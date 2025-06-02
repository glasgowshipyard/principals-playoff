/**
 * Core data types for Principals Playoff
 */

// Principle data structure
export const createPrinciple = (id, category, title, description, isCustom = false, customCategory = null) => ({
  id,
  category,
  title,
  description,
  isCustom,
  customCategory
});

// Configuration data structure
export const createConfiguration = () => ({
  branding: {
    logo: null,
    logoUrl: null,
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    orgName: ''
  },
  orgPrinciples: [],
  orgContext: '',
  timestamp: Date.now()
});

// Matchup data structure
export const createMatchup = (id, principle1, principle2) => ({
  id,
  principle1,
  principle2,
  winner: null,
  isComplete: false
});

// Round data structure
export const createRound = (name, matchups) => ({
  name,
  matchups,
  isComplete: false
});

// Bracket state structure
export const createBracketState = () => ({
  rounds: [],
  currentRound: 0,
  currentMatchup: 0,
  winners: [],
  eliminated: [],
  isComplete: false,
  finalRanking: []
});

// Results data structure
export const createResults = () => ({
  personalHierarchy: [],
  profile: {
    primaryCategory: '',
    style: '',
    strengths: [],
    tensions: [],
    recommendations: []
  },
  organizationalAlignment: null,
  metadata: {
    completionTime: 0,
    timestamp: Date.now(),
    version: '1.0.0'
  }
});

// Constants
export const CATEGORIES = {
  ACHIEVEMENT: 'Achievement/Mastery',
  AUTONOMY: 'Autonomy',
  SECURITY: 'Security',
  SERVICE: 'Service/Contribution',
  RELATIONSHIPS: 'Relationships/Connection',
  HEALTH: 'Health/Vitality'
};

export const ROUND_NAMES = [
  'Round of 16',
  'Quarterfinals',
  'Semifinals',
  'Finals'
];