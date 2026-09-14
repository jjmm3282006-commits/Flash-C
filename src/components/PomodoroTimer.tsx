import { useState, useEffect, useRef } from 'react';

interface PomodoroTimerProps {
  darkMode: boolean;
}

export default function PomodoroTimer({ darkMode }: PomodoroTimerProps) {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'work') {
        setSessions(prev => prev + 1);
        setMode('break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('work');
        setTimeLeft(WORK_TIME);
      }
      setIsRunning(false);
      // Play notification sound
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {
        // Audio not available
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className={`rounded-2xl p-6 h-full transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700'
        : 'bg-white shadow-lg shadow-orange-100/50 border border-gray-100'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🍅</span>
        <h3 className={`font-semibold text-sm uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Pomodoro
        </h3>
        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          {sessions} done
        </span>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-5">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'work'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'break'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative flex items-center justify-center mb-5">
        <svg className="w-40 h-40 -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={darkMode ? '#374151' : '#f3f4f6'}
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={mode === 'work' ? '#f97316' : '#10b981'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute text-center">
          <div className={`text-3xl font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {mode === 'work' ? 'Focus Time' : 'Break Time'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
            isRunning
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button
          onClick={resetTimer}
          className={`px-4 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
