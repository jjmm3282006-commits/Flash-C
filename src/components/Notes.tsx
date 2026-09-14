import { useState, useEffect } from 'react';

interface NotesProps {
  darkMode: boolean;
}

export default function Notes({ darkMode }: NotesProps) {
  const [note, setNote] = useState(() => {
    return localStorage.getItem('quickNote') || '';
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('quickNote', note);
    }, 500);
    return () => clearTimeout(timeout);
  }, [note]);

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;
  const charCount = note.length;

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700'
        : 'bg-white shadow-lg shadow-green-100/50 border border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <h3 className={`font-semibold text-sm uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Quick Notes
          </h3>
        </div>
        <div className={`flex gap-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down your thoughts, ideas, or anything you want to remember..."
        rows={4}
        className={`w-full px-4 py-3 rounded-xl text-sm resize-none transition-all ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
        } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      />

      <div className={`mt-3 flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <span>💾 Auto-saved to your browser</span>
        {note && (
          <button
            onClick={() => setNote('')}
            className={`px-2 py-1 rounded-lg transition-all ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
