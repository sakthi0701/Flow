import { useState, useEffect } from 'react';
import type { Preferences } from '../types';

interface FocusProps {
  preferences: Preferences;
}

const Focus = ({ preferences }: FocusProps) => {
  const [timeRemaining, setTimeRemaining] = useState(preferences.breakRatio.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: number;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setTimeRemaining(preferences.breakRatio.breakMinutes * 60);
      } else {
        setIsBreak(false);
        setTimeRemaining(preferences.breakRatio.workMinutes * 60);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, isBreak, preferences]);

  const totalSeconds = isBreak
    ? preferences.breakRatio.breakMinutes * 60
    : preferences.breakRatio.workMinutes * 60;
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 339.292;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeRemaining(preferences.breakRatio.workMinutes * 60);
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full -top-20 -left-20 animate-pulse"
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-gradient-to-tl from-green-200/20 to-blue-200/20 dark:from-green-500/10 dark:to-blue-500/10 rounded-full -bottom-20 -right-20 animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '4s' }}
        ></div>
      </div>

      <header className="relative z-10 flex items-center justify-between p-4">
        <button className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-gray-200"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Focus Mode</h1>
        <div className="w-10"></div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 space-y-8">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg
            className="absolute w-full h-full transform -rotate-90"
            viewBox="0 0 120 120"
          >
            <defs>
              <linearGradient id="progressGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <circle
              className="text-gray-200 dark:text-gray-700"
              cx="60"
              cy="60"
              fill="none"
              r="54"
              stroke="currentColor"
              strokeWidth="12"
            />
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="54"
              stroke="url(#progressGradient)"
              strokeDasharray="339.292"
              strokeDashoffset={339.292 - progress}
              strokeLinecap="round"
              strokeWidth="12"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="text-center">
            <h2 className="text-6xl font-bold text-gray-900 dark:text-white">
              {formatTime(timeRemaining)}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {isBreak ? 'Break time' : 'Time to focus'}
            </p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg w-full max-w-sm">
          <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            You'll get a <span className="font-bold text-blue-500">{preferences.breakRatio.breakMinutes} minute</span> break for
            every{' '}
            <span className="font-bold text-blue-500">{preferences.breakRatio.workMinutes} minutes</span> of work.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handleReset}
            className="p-4 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
          >
            <svg
              className="w-8 h-8 text-gray-800 dark:text-gray-200"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" />
            </svg>
          </button>

          <button
            onClick={handlePlayPause}
            className="px-10 py-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            {isRunning ? (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z" />
              </svg>
            ) : (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 256 256">
                <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setTimeRemaining(timeRemaining + 60)}
            className="p-4 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
          >
            <svg
              className="w-8 h-8 text-gray-800 dark:text-gray-200"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Focus;
