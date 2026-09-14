import { useState, useEffect } from 'react';

interface ClockProps {
  darkMode: boolean;
}

export default function Clock({ darkMode }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`rounded-2xl p-6 h-full transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700'
        : 'bg-white shadow-lg shadow-blue-100/50 border border-gray-100'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🕐</span>
        <h3 className={`font-semibold text-sm uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Current Time
        </h3>
      </div>
      
      <div className="text-center">
        <div className={`text-5xl sm:text-6xl font-mono font-bold tracking-tight ${
          darkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {String(hours).padStart(2, '0')}
          <span className={`${seconds % 2 === 0 ? 'opacity-100' : 'opacity-30'} transition-opacity`}>:</span>
          {String(minutes).padStart(2, '0')}
          <span className={`text-3xl sm:text-4xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            :{String(seconds).padStart(2, '0')}
          </span>
        </div>
        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {dateString}
        </p>
      </div>
    </div>
  );
}
