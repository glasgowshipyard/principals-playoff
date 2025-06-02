import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.js';

const Setup = () => {
  const navigate = useNavigate();
  const { state, actions } = useAppState();
  const { configuration } = state;
  
  const [localConfig, setLocalConfig] = useState({
    orgName: configuration.branding.orgName,
    primaryColor: configuration.branding.primaryColor,
    secondaryColor: configuration.branding.secondaryColor,
    orgPrinciples: configuration.orgPrinciples,
    orgContext: configuration.orgContext
  });
  
  const [orgPrincipleInput, setOrgPrincipleInput] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(configuration.branding.logoUrl);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, SVG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Image must be smaller than 2MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrgPrinciple = () => {
    if (orgPrincipleInput.trim() && localConfig.orgPrinciples.length < 10) {
      setLocalConfig(prev => ({
        ...prev,
        orgPrinciples: [...prev.orgPrinciples, orgPrincipleInput.trim()]
      }));
      setOrgPrincipleInput('');
    }
  };

  const handleRemoveOrgPrinciple = (index) => {
    setLocalConfig(prev => ({
      ...prev,
      orgPrinciples: prev.orgPrinciples.filter((_, i) => i !== index)
    }));
  };

  const handleSaveAndContinue = () => {
    // Update configuration in global state
    actions.updateConfiguration({
      branding: {
        ...configuration.branding,
        logo: logoFile,
        logoUrl: logoPreview,
        orgName: localConfig.orgName,
        primaryColor: localConfig.primaryColor,
        secondaryColor: localConfig.secondaryColor
      },
      orgPrinciples: localConfig.orgPrinciples,
      orgContext: localConfig.orgContext
    });

    // Navigate to selection page
    navigate('/selection');
  };

  const handleSkipSetup = () => {
    navigate('/selection');
  };

  return (
    <div className="setup-page">
      <h1>Setup & Branding</h1>
      <p>Customize the experience for your organization (optional - you can skip this step)</p>
      
      <div className="setup-content">
        <div className="card">
          <h2>Organization Branding</h2>
          
          {/* Logo Upload */}
          <div className="form-group">
            <label className="form-label">Organization Logo</label>
            <div className="logo-upload-area">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="logo-upload" className="logo-upload-button">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="logo-preview" />
                ) : (
                  <div className="logo-placeholder">
                    <span>📁</span>
                    <p>Click to upload logo</p>
                    <small>PNG, JPG, SVG (max 2MB)</small>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Organization Name */}
          <div className="form-group">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Your Organization"
              value={localConfig.orgName}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, orgName: e.target.value }))}
              maxLength={100}
            />
          </div>

          {/* Color Scheme */}
          <div className="color-inputs">
            <div className="form-group">
              <label className="form-label">Primary Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={localConfig.primaryColor}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={localConfig.primaryColor}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="color-text"
                  placeholder="#2563eb"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Secondary Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={localConfig.secondaryColor}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={localConfig.secondaryColor}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="color-text"
                  placeholder="#1d4ed8"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Organizational Context</h2>
          
          {/* Organizational Principles */}
          <div className="form-group">
            <label className="form-label">
              Your Organization's Core Principles ({localConfig.orgPrinciples.length}/10)
            </label>
            <div className="principle-input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Enter a principle (e.g., Innovation, Integrity, Excellence)"
                value={orgPrincipleInput}
                onChange={(e) => setOrgPrincipleInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOrgPrinciple()}
                maxLength={50}
              />
              <button
                type="button"
                onClick={handleAddOrgPrinciple}
                className="btn btn-secondary add-principle-btn"
                disabled={!orgPrincipleInput.trim() || localConfig.orgPrinciples.length >= 10}
              >
                Add
              </button>
            </div>
            
            {localConfig.orgPrinciples.length > 0 && (
              <div className="principle-list">
                {localConfig.orgPrinciples.map((principle, index) => (
                  <div key={index} className="principle-tag">
                    <span>{principle}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOrgPrinciple(index)}
                      className="remove-principle"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <small className="form-help">
              These will be used for alignment analysis after the tournament (hidden from participants during selection)
            </small>
          </div>

          {/* Context Description */}
          <div className="form-group">
            <label className="form-label">Organizational Context</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Brief description of your organization's culture, mission, or context..."
              value={localConfig.orgContext}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, orgContext: e.target.value }))}
              maxLength={500}
            />
            <small className="form-help">
              {localConfig.orgContext.length}/500 characters
            </small>
          </div>
        </div>

        {/* Preview */}
        {(localConfig.orgName || logoPreview) && (
          <div className="card">
            <h2>Preview</h2>
            <div 
              className="branding-preview"
              style={{
                '--primary-color': localConfig.primaryColor,
                '--secondary-color': localConfig.secondaryColor
              }}
            >
              {logoPreview && <img src={logoPreview} alt="Logo" className="preview-logo" />}
              {localConfig.orgName && <h3 className="preview-org-name">{localConfig.orgName}</h3>}
              <div className="preview-badge" style={{ backgroundColor: localConfig.primaryColor }}>
                Principles Playoff
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="setup-actions">
          <button onClick={handleSkipSetup} className="btn btn-secondary">
            Skip Setup
          </button>
          <button onClick={handleSaveAndContinue} className="btn btn-primary">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setup;