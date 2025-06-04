import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState.js';
import Setup from './pages/Setup.jsx';
import Selection from './pages/Selection.jsx';
import Tournament from './pages/Tournament.jsx';
import Results from './pages/Results.jsx';
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
              <Route path="/setup" element={<Setup />} />
              <Route path="/selection" element={<Selection />} />
              <Route path="/tournament" element={<Tournament />} />
              <Route path="/results" element={<Results />} />
              <Route path="/" element={<Navigate to="/setup" replace />} />
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
