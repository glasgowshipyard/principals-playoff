import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.js';
import { getCurrentMatchup, advanceWinner, isTournamentComplete, generateFinalRanking } from '../utils/bracketUtils.js';
import { analyzePersonalProfile, analyzeOrganizationalAlignment } from '../utils/analysisUtils.js';

const Tournament = () => {
  const navigate = useNavigate();
  const { state, actions } = useAppState();
  const { bracketState, configuration, startTime } = state;
  
  const [currentMatchupData, setCurrentMatchupData] = useState(null);
  const [showBracket, setShowBracket] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Redirect if no tournament data
    if (!bracketState.rounds || bracketState.rounds.length === 0) {
      navigate('/selection');
      return;
    }

    // Get current matchup
    const matchupData = getCurrentMatchup(bracketState.rounds);
    setCurrentMatchupData(matchupData);

    // Check if tournament is complete
    if (isTournamentComplete(bracketState.rounds)) {
      handleTournamentComplete();
    }
  }, [bracketState, navigate]);

  const handlePrincipleSelection = async (winner) => {
    if (!currentMatchupData || animating) return;

    setAnimating(true);

    // Advance winner and update bracket state
    const updatedRounds = advanceWinner(
      bracketState.rounds,
      currentMatchupData.roundIndex,
      currentMatchupData.matchupIndex,
      winner
    );

    const newBracketState = {
      ...bracketState,
      rounds: updatedRounds
    };

    actions.advanceWinner(newBracketState);

    // Brief animation delay
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  const handleTournamentComplete = () => {
    const finalRanking = generateFinalRanking(bracketState.rounds);
    const completionTime = startTime ? Date.now() - startTime : 0;

    // Analyze results
    const personalProfile = analyzePersonalProfile(finalRanking);
    const organizationalAlignment = configuration.orgPrinciples.length > 0 
      ? analyzeOrganizationalAlignment(finalRanking, configuration.orgPrinciples, configuration.orgContext)
      : null;

    const results = {
      personalHierarchy: finalRanking,
      profile: personalProfile,
      organizationalAlignment,
      metadata: {
        completionTime,
        timestamp: Date.now(),
        version: '1.0.0'
      }
    };

    actions.setResults(results);
    navigate('/results');
  };

  const getTournamentProgress = () => {
    if (!bracketState.rounds) return { current: 0, total: 0 };
    
    let completedMatchups = 0;
    let totalMatchups = 0;
    
    bracketState.rounds.forEach(round => {
      totalMatchups += round.matchups.length;
      completedMatchups += round.matchups.filter(m => m.isComplete).length;
    });
    
    return { current: completedMatchups, total: totalMatchups };
  };

  const getCurrentRoundName = () => {
    if (!currentMatchupData) return '';
    return bracketState.rounds[currentMatchupData.roundIndex]?.name || '';
  };

  const progress = getTournamentProgress();

  if (!currentMatchupData) {
    return (
      <div className="tournament-page">
        <div className="tournament-loading">
          <h1>Preparing Tournament...</h1>
          <p>Setting up your bracket</p>
        </div>
      </div>
    );
  }

  const { matchup } = currentMatchupData;

  return (
    <div className="tournament-page">
      <div className="tournament-header">
        <h1>Principles Playoff</h1>
        <div className="tournament-info">
          <div className="round-info">
            <span className="round-name">{getCurrentRoundName()}</span>
            <span className="matchup-count">
              Matchup {currentMatchupData.matchupIndex + 1} of {bracketState.rounds[currentMatchupData.roundIndex]?.matchups.length}
            </span>
          </div>
          <div className="progress-info">
            <span className="progress-text">
              {progress.current} of {progress.total} completed
            </span>
            <div className="tournament-progress-bar">
              <div 
                className="tournament-progress-fill"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="matchup-container">
        <div className="matchup-header">
          <h2>Choose the principle that matters more to you</h2>
          <p>When you can only have one, which drives your decisions?</p>
        </div>

        <div className="versus-container">
          <div 
            className={`principle-option ${animating ? 'animating' : ''}`}
            onClick={() => handlePrincipleSelection(matchup.principle1)}
          >
            <div className="principle-content">
              <h3 className="principle-title">{matchup.principle1.title}</h3>
              <p className="principle-description">{matchup.principle1.description}</p>
              <div className="principle-category">{matchup.principle1.category}</div>
            </div>
            <div className="selection-overlay">
              <span className="selection-text">Choose This</span>
            </div>
          </div>

          <div className="versus-divider">
            <span className="versus-text">VS</span>
          </div>

          <div 
            className={`principle-option ${animating ? 'animating' : ''}`}
            onClick={() => handlePrincipleSelection(matchup.principle2)}
          >
            <div className="principle-content">
              <h3 className="principle-title">{matchup.principle2.title}</h3>
              <p className="principle-description">{matchup.principle2.description}</p>
              <div className="principle-category">{matchup.principle2.category}</div>
            </div>
            <div className="selection-overlay">
              <span className="selection-text">Choose This</span>
            </div>
          </div>
        </div>

        <div className="matchup-help">
          <p>💡 <strong>Tip:</strong> Don't overthink it. Go with your gut reaction - what would you actually choose when forced to decide?</p>
        </div>
      </div>

      <div className="tournament-controls">
        <button
          onClick={() => setShowBracket(!showBracket)}
          className="btn btn-secondary bracket-toggle"
        >
          {showBracket ? 'Hide' : 'Show'} Bracket
        </button>
      </div>

      {showBracket && (
        <div className="bracket-container">
          <h3>Tournament Bracket</h3>
          <div className="bracket-rounds">
            {bracketState.rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="bracket-round">
                <h4 className="bracket-round-title">{round.name}</h4>
                <div className="bracket-matchups">
                  {round.matchups.map((matchup, matchupIndex) => (
                    <div 
                      key={matchup.id} 
                      className={`bracket-matchup ${
                        currentMatchupData?.roundIndex === roundIndex && 
                        currentMatchupData?.matchupIndex === matchupIndex ? 'current' : ''
                      } ${matchup.isComplete ? 'completed' : ''}`}
                    >
                      {matchup.principle1 && matchup.principle2 ? (
                        <>
                          <div className={`bracket-principle ${matchup.winner?.id === matchup.principle1.id ? 'winner' : matchup.isComplete ? 'loser' : ''}`}>
                            {matchup.principle1.title}
                          </div>
                          <div className={`bracket-principle ${matchup.winner?.id === matchup.principle2.id ? 'winner' : matchup.isComplete ? 'loser' : ''}`}>
                            {matchup.principle2.title}
                          </div>
                        </>
                      ) : (
                        <div className="bracket-tbd">TBD</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournament;