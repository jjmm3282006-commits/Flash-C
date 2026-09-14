import { useState, useEffect } from 'react';
import Clock from './components/Clock';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import Notes from './components/Notes';
import WeatherWidget from './components/WeatherWidget';
import QuickLinks from './components/QuickLinks';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/70 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AnyDevice
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            {getGreeting()} 👋
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your personal dashboard — works on any device, any browser.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Clock Widget - spans full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Clock darkMode={darkMode} />
          </div>

          {/* Weather Widget */}
          <div>
            <WeatherWidget darkMode={darkMode} />
          </div>

          {/* Quick Links */}
          <div>
            <QuickLinks darkMode={darkMode} />
          </div>

          {/* Todo List - spans 2 columns on large screens */}
          <div className="sm:col-span-2 lg:col-span-2">
            <TodoList darkMode={darkMode} />
          </div>

          {/* Pomodoro Timer */}
          <div>
            <PomodoroTimer darkMode={darkMode} />
          </div>

          {/* Notes - spans full width */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Notes darkMode={darkMode} />
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-12 pb-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>Built with HTML, CSS & JavaScript — runs anywhere 🚀</p>
          <p className="mt-1">Responsive • Offline-capable • No install needed</p>
        </footer>
      </main>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
