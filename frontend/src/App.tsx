import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Focus from './pages/Focus';
import Coach from './pages/Coach';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import type { Preferences } from './types';

function App() {
  const [preferences, setPreferences] = useState<Preferences>({
    breakRatio: {
      workMinutes: 25,
      breakMinutes: 5,
    },
    coachPersonality: 'friendly',
    autoScheduling: true,
    energyTracking: 'auto',
  });

  useEffect(() => {
    const saved = localStorage.getItem('preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const updatePreferences = (newPrefs: Preferences) => {
    setPreferences(newPrefs);
    localStorage.setItem('preferences', JSON.stringify(newPrefs));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/focus" element={<Focus preferences={preferences} />} />
          <Route path="/coach" element={<Coach preferences={preferences} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings preferences={preferences} onUpdate={updatePreferences} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
