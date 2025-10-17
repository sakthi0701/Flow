import { useState } from 'react';
import type { Preferences } from '../types';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  preferences: Preferences;
  onUpdate: (preferences: Preferences) => void;
}

const Settings = ({ preferences, onUpdate }: SettingsProps) => {
  const navigate = useNavigate();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleSave = () => {
    onUpdate(localPrefs);
    navigate('/');
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            Settings
          </h1>
          <button
            onClick={handleSave}
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            Save
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Coach Personality
          </h2>
          <div className="space-y-2">
            {['friendly', 'professional', 'minimal'].map((personality) => (
              <label
                key={personality}
                className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name="personality"
                  value={personality}
                  checked={localPrefs.coachPersonality === personality}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      coachPersonality: e.target.value as 'friendly' | 'professional' | 'minimal',
                    })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-800 dark:text-gray-200 capitalize">
                  {personality}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Break Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={localPrefs.breakRatio.workMinutes}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    breakRatio: {
                      ...localPrefs.breakRatio,
                      workMinutes: parseInt(e.target.value) || 25,
                    },
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={localPrefs.breakRatio.breakMinutes}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    breakRatio: {
                      ...localPrefs.breakRatio,
                      breakMinutes: parseInt(e.target.value) || 5,
                    },
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Scheduling
          </h2>
          <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-gray-800 dark:text-gray-200">Auto-scheduling</span>
            <input
              type="checkbox"
              checked={localPrefs.autoScheduling}
              onChange={(e) =>
                setLocalPrefs({
                  ...localPrefs,
                  autoScheduling: e.target.checked,
                })
              }
              className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
            />
          </label>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Energy Tracking
          </h2>
          <div className="space-y-2">
            {['manual', 'auto'].map((mode) => (
              <label
                key={mode}
                className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name="energyTracking"
                  value={mode}
                  checked={localPrefs.energyTracking === mode}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      energyTracking: e.target.value as 'manual' | 'auto',
                    })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-800 dark:text-gray-200 capitalize">
                  {mode}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">About</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>Life Scheduler & Productivity Assistant</p>
            <p>Version 1.0.0</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Built with AI-powered scheduling and contextual awareness
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
