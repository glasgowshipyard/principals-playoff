import { createMatchup, createRound, ROUND_NAMES } from '../data/types.js';

/**
 * Utility functions for tournament bracket management
 */

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate tournament bracket from selected principles
export const generateBracket = (selectedPrinciples) => {
  if (selectedPrinciples.length !== 16) {
    throw new Error('Tournament requires exactly 16 principles');
  }

  // Randomize seeding to avoid position bias
  const shuffled = shuffleArray(selectedPrinciples);
  
  // Create Round of 16 matchups
  const round1Matchups = [];
  for (let i = 0; i < 16; i += 2) {
    round1Matchups.push(
      createMatchup(
        `r1-m${i/2 + 1}`,
        shuffled[i],
        shuffled[i + 1]
      )
    );
  }

  // Create all rounds with placeholder matchups
  const rounds = [
    createRound(ROUND_NAMES[0], round1Matchups),
    createRound(ROUND_NAMES[1], createPlaceholderMatchups(4, 'r2')),
    createRound(ROUND_NAMES[2], createPlaceholderMatchups(2, 'r3')),
    createRound(ROUND_NAMES[3], createPlaceholderMatchups(1, 'r4'))
  ];

  return rounds;
};

// Create placeholder matchups for future rounds
const createPlaceholderMatchups = (count, roundPrefix) => {
  const matchups = [];
  for (let i = 0; i < count; i++) {
    matchups.push(
      createMatchup(
        `${roundPrefix}-m${i + 1}`,
        null,
        null
      )
    );
  }
  return matchups;
};

// Advance winners to next round
export const advanceWinner = (rounds, roundIndex, matchupIndex, winner) => {
  const updatedRounds = [...rounds];
  const currentRound = updatedRounds[roundIndex];
  const currentMatchup = currentRound.matchups[matchupIndex];

  // Set the winner for current matchup
  currentMatchup.winner = winner;
  currentMatchup.isComplete = true;

  // Check if current round is complete
  const allMatchupsComplete = currentRound.matchups.every(m => m.isComplete);
  if (allMatchupsComplete) {
    currentRound.isComplete = true;

    // Advance winners to next round if it exists
    if (roundIndex < rounds.length - 1) {
      const nextRound = updatedRounds[roundIndex + 1];
      const winners = currentRound.matchups.map(m => m.winner);
      
      // Fill next round matchups
      for (let i = 0; i < winners.length; i += 2) {
        const nextMatchupIndex = Math.floor(i / 2);
        if (nextMatchupIndex < nextRound.matchups.length) {
          nextRound.matchups[nextMatchupIndex].principle1 = winners[i];
          nextRound.matchups[nextMatchupIndex].principle2 = winners[i + 1];
        }
      }
    }
  }

  return updatedRounds;
};

// Get current active matchup
export const getCurrentMatchup = (rounds) => {
  for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
    const round = rounds[roundIndex];
    for (let matchupIndex = 0; matchupIndex < round.matchups.length; matchupIndex++) {
      const matchup = round.matchups[matchupIndex];
      if (!matchup.isComplete && matchup.principle1 && matchup.principle2) {
        return { roundIndex, matchupIndex, matchup };
      }
    }
  }
  return null;
};

// Generate final ranking from tournament results
export const generateFinalRanking = (rounds) => {
  if (!rounds || rounds.length === 0) return [];

  const ranking = [];
  
  // Winner (1st place)
  const finalRound = rounds[rounds.length - 1];
  if (finalRound.isComplete && finalRound.matchups[0].winner) {
    ranking.push(finalRound.matchups[0].winner);
  }

  // Runner-up (2nd place)
  const finalMatchup = finalRound.matchups[0];
  if (finalMatchup.isComplete) {
    const runnerUp = finalMatchup.principle1.id === finalMatchup.winner.id 
      ? finalMatchup.principle2 
      : finalMatchup.principle1;
    ranking.push(runnerUp);
  }

  // Semifinal losers (3rd and 4th place)
  if (rounds.length >= 3) {
    const semifinalRound = rounds[rounds.length - 2];
    semifinalRound.matchups.forEach(matchup => {
      if (matchup.isComplete && matchup.winner) {
        const loser = matchup.principle1.id === matchup.winner.id 
          ? matchup.principle2 
          : matchup.principle1;
        ranking.push(loser);
      }
    });
  }

  // Continue for remaining rounds
  for (let roundIndex = rounds.length - 3; roundIndex >= 0; roundIndex--) {
    const round = rounds[roundIndex];
    round.matchups.forEach(matchup => {
      if (matchup.isComplete && matchup.winner) {
        const loser = matchup.principle1.id === matchup.winner.id 
          ? matchup.principle2 
          : matchup.principle1;
        ranking.push(loser);
      }
    });
  }

  return ranking;
};

// Check if tournament is complete
export const isTournamentComplete = (rounds) => {
  if (!rounds || rounds.length === 0) return false;
  const finalRound = rounds[rounds.length - 1];
  return finalRound.isComplete && finalRound.matchups[0].winner !== null;
};