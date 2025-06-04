import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState.js';
import Setup from './pages/Setup.jsx';
import Selection from './pages/Selection.jsx';
import ProSelection from './pages/ProSelection.jsx';
import Tournament from './pages/Tournament.jsx';
import Results from './pages/Results.jsx';
import ProResults from './pages/ProResults.jsx';
import './App.css';

function App() {
  return (
    <AppStateProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>Principles Playoff</h1>
            <p className="tagline">Tournament-style elimination to discover what actually drives us</p>
          </header>
          
          <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/selection" replace />} />
            <Route path="/selection" element={<Selection />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/results" element={<Results />} />
            
            <Route path="/pro" element={<Setup />} />
            <Route path="/pro/selection" element={<ProSelection />} />
            <Route path="/pro/tournament" element={<Tournament />} />
            <Route path="/pro/results" element={<ProResults />} />
          </Routes>          
          </main>
          
          <footer className="app-footer">
            <p>Built for humans who want to understand what actually drives them</p>
          </footer>
        </div>
      </Router>
    </AppStateProvider>
  );
}

export default App
