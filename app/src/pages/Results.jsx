import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.js';
import { downloadPDF } from '../utils/pdfExport.js';

const Results = () => {
  const navigate = useNavigate();
  const { state, actions } = useAppState();
  const { results, configuration } = state;
  
  const [showOrgAlignment, setShowOrgAlignment] = useState(false);
  const [completionTimeDisplay, setCompletionTimeDisplay] = useState('');

  useEffect(() => {
    // Redirect if no results
    if (!results.personalHierarchy || results.personalHierarchy.length === 0) {
      navigate('/selection');
      return;
    }

    // Format completion time
    if (results.metadata.completionTime) {
      const minutes = Math.floor(results.metadata.completionTime / 60000);
      const seconds = Math.floor((results.metadata.completionTime % 60000) / 1000);
      setCompletionTimeDisplay(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    // Show organizational alignment after a delay if available
    if (results.organizationalAlignment) {
      setTimeout(() => {
        setShowOrgAlignment(true);
      }, 2000);
    }
  }, [results, navigate]);

  const handleDownloadPDF = async () => {
    try {
      await downloadPDF(results, configuration);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Sorry, PDF generation failed. Please try again.');
    }
  };

  const handleRestartAssessment = () => {
    actions.resetState();
    navigate('/setup');
  };

  const handleRetakeWithSameConfig = () => {
    // Keep configuration but reset everything else
    const currentConfig = configuration;
    actions.resetState();
    actions.updateConfiguration(currentConfig);
    navigate('/selection');
  };

  const getRankSuffix = (rank) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const getPrincipleRankColor = (rank) => {
    if (rank <= 3) return '#059669'; // Green for top 3
    if (rank <= 8) return '#2563eb'; // Blue for top half
    return '#6b7280'; // Gray for lower half
  };

  return (
    <div className="results-page">
      <div className="results-header">
        <h1>Your Principles Playoff Results</h1>
        <div className="completion-info">
          <span className="completion-time">Completed in {completionTimeDisplay}</span>
          <span className="completion-date">
            {new Date(results.metadata.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Personal Hierarchy */}
      <div className="results-section">
        <div className="card">
          <h2>Your Principle Hierarchy</h2>
          <p className="section-description">
            This is what truly drives you when forced to choose. Your #1 principle won every head-to-head battle.
          </p>
          
          <div className="hierarchy-grid">
            {results.personalHierarchy.map((principle, index) => {
              const rank = index + 1;
              return (
                <div 
                  key={principle.id} 
                  className={`hierarchy-item rank-${rank <= 4 ? rank : 'other'}`}
                  style={{ '--rank-color': getPrincipleRankColor(rank) }}
                >
                  <div className="rank-badge">
                    <span className="rank-number">{rank}</span>
                    <span className="rank-suffix">{getRankSuffix(rank)}</span>
                  </div>
                  <div className="principle-info">
                    <h4 className="principle-title">{principle.title}</h4>
                    <p className="principle-description">{principle.description}</p>
                    <span className="principle-category">{principle.category}</span>
                  </div>
                  {rank === 1 && <div className="champion-badge">🏆 Champion</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Personal Profile Analysis */}
      <div className="results-section">
        <div className="card">
          <h2>Your Decision-Making Profile</h2>
          
          <div className="profile-overview">
            <div className="profile-stat">
              <span className="stat-label">Primary Drive</span>
              <span className="stat-value">{results.profile.primaryCategory}</span>
            </div>
            <div className="profile-stat">
              <span className="stat-label">Decision Style</span>
              <span className="stat-value">{results.profile.style}</span>
            </div>
          </div>

          <div className="profile-sections">
            <div className="profile-section">
              <h3>Your Strengths</h3>
              <ul className="insight-list">
                {results.profile.strengths.map((strength, index) => (
                  <li key={index} className="insight-item strength">
                    <span className="insight-icon">💪</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {results.profile.tensions.length > 0 && (
              <div className="profile-section">
                <h3>Potential Tensions</h3>
                <ul className="insight-list">
                  {results.profile.tensions.map((tension, index) => (
                    <li key={index} className="insight-item tension">
                      <span className="insight-icon">⚖️</span>
                      {tension}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="profile-section">
              <h3>Recommendations</h3>
              <ul className="insight-list">
                {results.profile.recommendations.map((rec, index) => (
                  <li key={index} className="insight-item recommendation">
                    <span className="insight-icon">💡</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Organizational Alignment (if available) */}
      {results.organizationalAlignment && (
        <div className={`results-section ${showOrgAlignment ? 'show' : ''}`}>
          <div className="card org-alignment-card">
            <h2>Organizational Alignment Analysis</h2>
            <p className="section-description">
              How well do your personal principles align with your organization's stated values?
            </p>

            <div className="alignment-score">
              <div className="score-circle">
                <span className="score-number">{results.organizationalAlignment.alignmentScore}</span>
                <span className="score-label">% Match</span>
              </div>
              <div className="score-interpretation">
                {results.organizationalAlignment.alignmentScore >= 70 ? (
                  <span className="score-good">Strong alignment - your values naturally fit</span>
                ) : results.organizationalAlignment.alignmentScore >= 40 ? (
                  <span className="score-moderate">Moderate alignment - some areas to explore</span>
                ) : (
                  <span className="score-low">Lower alignment - opportunities for discussion</span>
                )}
              </div>
            </div>

            <div className="alignment-sections">
              {results.organizationalAlignment.matches.length > 0 && (
                <div className="alignment-section">
                  <h3>Strong Matches</h3>
                  <ul className="insight-list">
                    {results.organizationalAlignment.matches.map((match, index) => (
                      <li key={index} className="insight-item match">
                        <span className="insight-icon">✅</span>
                        {match}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.organizationalAlignment.conflicts.length > 0 && (
                <div className="alignment-section">
                  <h3>Areas to Explore</h3>
                  <ul className="insight-list">
                    {results.organizationalAlignment.conflicts.map((conflict, index) => (
                      <li key={index} className="insight-item conflict">
                        <span className="insight-icon">🔍</span>
                        {conflict}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="alignment-section">
                <h3>Navigation Strategies</h3>
                <ul className="insight-list">
                  {results.organizationalAlignment.strategies.map((strategy, index) => (
                    <li key={index} className="insight-item strategy">
                      <span className="insight-icon">🎯</span>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="alignment-section">
                <h3>Discussion Starters</h3>
                <ul className="insight-list">
                  {results.organizationalAlignment.discussionPoints.map((point, index) => (
                    <li key={index} className="insight-item discussion">
                      <span className="insight-icon">💬</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evolution Note */}
      <div className="results-section">
        <div className="card evolution-card">
          <h2>Your Principles Evolve</h2>
          <p>
            Your guiding principles aren't fixed. They shift with life experiences, new responsibilities, 
            and personal growth. Consider retaking this assessment:
          </p>
          <ul className="evolution-list">
            <li>Annually for ongoing self-awareness</li>
            <li>When changing roles or careers</li>
            <li>After major life events (marriage, parenthood, health changes)</li>
            <li>When feeling misaligned or stuck in decisions</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="results-actions">
        <div className="action-group">
          <button onClick={handleDownloadPDF} className="btn btn-primary">
            📄 Download PDF Report
          </button>
          <button onClick={handleRetakeWithSameConfig} className="btn btn-secondary">
            🔄 Retake Assessment
          </button>
        </div>
        
        <div className="action-group">
          <button onClick={handleRestartAssessment} className="btn btn-secondary">
            🆕 Start Fresh
          </button>
        </div>
      </div>

      {/* Share Results */}
      <div className="results-section">
        <div className="card share-card">
          <h3>Understanding Your Results</h3>
          <div className="share-content">
            <p>
              <strong>What this means:</strong> Your #1 principle is what you truly prioritize when forced to choose. 
              The ranking reveals your authentic decision-making hierarchy, not what you think should matter.
            </p>
            <p>
              <strong>How to use this:</strong> Use these insights for career decisions, relationship choices, 
              and understanding potential conflicts between your values and your environment.
            </p>
            <p>
              <strong>Remember:</strong> There are no "right" or "wrong" principles. This is about understanding 
              your authentic drivers, not judging them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;