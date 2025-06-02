import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.js';
import { PREDEFINED_PRINCIPLES, PRINCIPLES_BY_CATEGORY, CATEGORY_NAMES } from '../data/principles.js';
import { createPrinciple } from '../data/types.js';
import { generateBracket } from '../utils/bracketUtils.js';

const Selection = () => {
  const navigate = useNavigate();
  const { state, actions } = useAppState();
  const { selectedPrinciples, customPrinciples } = state;
  
  const [localSelected, setLocalSelected] = useState(new Set(selectedPrinciples.map(p => p.id)));
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customCategory, setCustomCategory] = useState(CATEGORY_NAMES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Combine predefined and custom principles
  const allPrinciples = useMemo(() => {
    return [...PREDEFINED_PRINCIPLES, ...customPrinciples];
  }, [customPrinciples]);

  // Filter principles based on search and category
  const filteredPrinciples = useMemo(() => {
    let filtered = allPrinciples;

    if (searchTerm) {
      filtered = filtered.filter(principle =>
        principle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        principle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(principle => principle.category === activeCategory);
    }

    return filtered;
  }, [allPrinciples, searchTerm, activeCategory]);

  // Group filtered principles by category
  const groupedPrinciples = useMemo(() => {
    return filteredPrinciples.reduce((acc, principle) => {
      if (!acc[principle.category]) {
        acc[principle.category] = [];
      }
      acc[principle.category].push(principle);
      return acc;
    }, {});
  }, [filteredPrinciples]);

  const handlePrincipleToggle = (principle) => {
    const newSelected = new Set(localSelected);
    
    if (newSelected.has(principle.id)) {
      newSelected.delete(principle.id);
    } else if (newSelected.size < 16) {
      newSelected.add(principle.id);
    }
    
    setLocalSelected(newSelected);
  };

  const handleAddCustomPrinciple = () => {
    if (!customTitle.trim() || !customDescription.trim()) return;

    const customPrinciple = createPrinciple(
      `custom-${Date.now()}`,
      customCategory,
      customTitle.trim(),
      customDescription.trim(),
      true
    );

    actions.addCustomPrinciple(customPrinciple);
    
    // Auto-select the new custom principle if we have room
    if (localSelected.size < 16) {
      setLocalSelected(prev => new Set([...prev, customPrinciple.id]));
    }

    // Reset form
    setCustomTitle('');
    setCustomDescription('');
    setShowCustomModal(false);
  };

  const handleStartTournament = () => {
    const selected = allPrinciples.filter(p => localSelected.has(p.id));
    
    if (selected.length !== 16) return;

    // Update global state with selected principles
    actions.setSelectedPrinciples(selected);
    
    // Generate tournament bracket
    const bracket = generateBracket(selected);
    const bracketState = {
      rounds: bracket,
      currentRound: 0,
      currentMatchup: 0,
      winners: [],
      eliminated: [],
      isComplete: false,
      finalRanking: []
    };
    
    actions.initializeTournament(bracketState);
    navigate('/tournament');
  };

  const selectedCount = localSelected.size;
  const canProceed = selectedCount === 16;

  return (
    <div className="selection-page">
      <div className="selection-header">
        <h1>Choose Your Principles</h1>
        <p>Select exactly 16 principles that guide your decisions. These will compete head-to-head in the tournament.</p>
        
        <div className="selection-progress">
          <div className="progress-info">
            <span className="selection-count">
              {selectedCount}/16 selected
            </span>
            {selectedCount > 16 && (
              <span className="selection-warning">Too many selected - please remove {selectedCount - 16}</span>
            )}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min((selectedCount / 16) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="selection-controls">
        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search principles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category filter */}
        <div className="category-filter">
          <button
            onClick={() => setActiveCategory('all')}
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          >
            All Categories
          </button>
          {CATEGORY_NAMES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Add custom principle */}
        <button
          onClick={() => setShowCustomModal(true)}
          className="btn btn-secondary add-custom-btn"
        >
          + Add Custom Principle
        </button>
      </div>

      <div className="principles-grid">
        {Object.entries(groupedPrinciples).map(([category, principles]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="principles-list">
              {principles.map(principle => (
                <div
                  key={principle.id}
                  className={`principle-card ${localSelected.has(principle.id) ? 'selected' : ''} ${
                    localSelected.size >= 16 && !localSelected.has(principle.id) ? 'disabled' : ''
                  }`}
                  onClick={() => handlePrincipleToggle(principle)}
                >
                  <div className="principle-header">
                    <h4 className="principle-title">{principle.title}</h4>
                    {principle.isCustom && <span className="custom-badge">Custom</span>}
                    <div className="principle-checkbox">
                      {localSelected.has(principle.id) && <span>✓</span>}
                    </div>
                  </div>
                  <p className="principle-description">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom principle modal */}
      {showCustomModal && (
        <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Custom Principle</h3>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="form-input"
              >
                {CATEGORY_NAMES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Principle Title</label>
              <input
                type="text"
                placeholder="e.g., Work-life integration"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="form-input"
                maxLength={50}
              />
              <small className="form-help">{customTitle.length}/50 characters</small>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Brief description of what this principle means to you..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="form-input"
                rows={3}
                maxLength={100}
              />
              <small className="form-help">{customDescription.length}/100 characters</small>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowCustomModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomPrinciple}
                className="btn btn-primary"
                disabled={!customTitle.trim() || !customDescription.trim()}
              >
                Add Principle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="selection-actions">
        <button
          onClick={() => navigate('/setup')}
          className="btn btn-secondary"
        >
          ← Back to Setup
        </button>
        
        <button
          onClick={handleStartTournament}
          className="btn btn-primary"
          disabled={!canProceed}
        >
          Start Tournament →
        </button>
      </div>
    </div>
  );
};

export default Selection;