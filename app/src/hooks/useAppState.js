import { createContext, useContext, useReducer } from 'react';
import { createConfiguration, createBracketState, createResults } from '../data/types.js';

// Initial state
const initialState = {
  configuration: createConfiguration(),
  selectedPrinciples: [],
  customPrinciples: [],
  bracketState: createBracketState(),
  results: createResults(),
  currentStep: 'setup', // setup, selection, tournament, results
  startTime: null
};

// Action types
const ACTIONS = {
  UPDATE_CONFIGURATION: 'UPDATE_CONFIGURATION',
  ADD_CUSTOM_PRINCIPLE: 'ADD_CUSTOM_PRINCIPLE',
  SET_SELECTED_PRINCIPLES: 'SET_SELECTED_PRINCIPLES',
  INITIALIZE_TOURNAMENT: 'INITIALIZE_TOURNAMENT',
  ADVANCE_WINNER: 'ADVANCE_WINNER',
  SET_RESULTS: 'SET_RESULTS',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  START_TIMER: 'START_TIMER',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_CONFIGURATION:
      return {
        ...state,
        configuration: { ...state.configuration, ...action.payload }
      };

    case ACTIONS.ADD_CUSTOM_PRINCIPLE:
      return {
        ...state,
        customPrinciples: [...state.customPrinciples, action.payload]
      };

    case ACTIONS.SET_SELECTED_PRINCIPLES:
      return {
        ...state,
        selectedPrinciples: action.payload
      };

    case ACTIONS.INITIALIZE_TOURNAMENT:
      return {
        ...state,
        bracketState: action.payload,
        currentStep: 'tournament',
        startTime: Date.now()
      };

    case ACTIONS.ADVANCE_WINNER:
      return {
        ...state,
        bracketState: action.payload
      };

    case ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        currentStep: 'results'
      };

    case ACTIONS.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      };

    case ACTIONS.START_TIMER:
      return {
        ...state,
        startTime: Date.now()
      };

    case ACTIONS.RESET_STATE:
      return {
        ...initialState,
        configuration: createConfiguration(),
        bracketState: createBracketState(),
        results: createResults()
      };

    default:
      return state;
  }
};

// Create context
const AppStateContext = createContext();

// Provider component
export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    updateConfiguration: (config) => 
      dispatch({ type: ACTIONS.UPDATE_CONFIGURATION, payload: config }),
    
    addCustomPrinciple: (principle) =>
      dispatch({ type: ACTIONS.ADD_CUSTOM_PRINCIPLE, payload: principle }),
    
    setSelectedPrinciples: (principles) =>
      dispatch({ type: ACTIONS.SET_SELECTED_PRINCIPLES, payload: principles }),
    
    initializeTournament: (bracketState) =>
      dispatch({ type: ACTIONS.INITIALIZE_TOURNAMENT, payload: bracketState }),
    
    advanceWinner: (bracketState) =>
      dispatch({ type: ACTIONS.ADVANCE_WINNER, payload: bracketState }),
    
    setResults: (results) =>
      dispatch({ type: ACTIONS.SET_RESULTS, payload: results }),
    
    setCurrentStep: (step) =>
      dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: step }),
    
    startTimer: () =>
      dispatch({ type: ACTIONS.START_TIMER }),
    
    resetState: () =>
      dispatch({ type: ACTIONS.RESET_STATE })
  };

  return (
    <AppStateContext.Provider value={{ state, actions }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to use app state
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};