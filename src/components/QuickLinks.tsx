import { useState, useEffect } from 'react';

interface QuickLinksProps {
  darkMode: boolean;
}

interface Link {
  name: string;
  url: string;
  icon: string;
}

const defaultLinks: Link[] = [
  { name: 'Google', url: 'https://google.com', icon: '🔍' },
  { name: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { name: 'GitHub', url: 'https://github.com', icon: '💻' },
  { name: 'Reddit', url: 'https://reddit.com', icon: '🗨️' },
  { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
  { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
];

export default function QuickLinks({ darkMode }: QuickLinksProps) {
  const [links, setLinks] = useState<Link[]>(() => {
    const saved = localStorage.getItem('quickLinks');
    return saved ? JSON.parse(saved) : defaultLinks;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('quickLinks', JSON.stringify(links));
  }, [links]);

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith('http')) url = 'https://' + url;
    setLinks(prev => [...prev, { name: newName.trim(), url, icon: '🔗' }]);
    setNewName('');
    setNewUrl('');
  };

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`rounded-2xl p-6 h-full transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700'
        : 'bg-white shadow-lg shadow-indigo-100/50 border border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔗</span>
          <h3 className={`font-semibold text-sm uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Quick Links
          </h3>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`text-xs px-2 py-1 rounded-lg transition-all ${
            isEditing
              ? 'bg-blue-500 text-white'
              : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {links.map((link, index) => (
          <div key={index} className="relative group">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } ${isEditing ? 'opacity-60' : ''}`}
            >
              <span className="text-2xl">{link.icon}</span>
              <span className={`text-[10px] truncate w-full ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {link.name}
              </span>
            </a>
            {isEditing && (
              <button
                onClick={(e) => { e.preventDefault(); removeLink(index); }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Link Form */}
      {isEditing && (
        <form onSubmit={addLink} className="space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className={`w-full px-3 py-2 rounded-lg text-xs ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL (e.g., example.com)"
            className={`w-full px-3 py-2 rounded-lg text-xs ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            + Add Link
          </button>
        </form>
      )}
    </div>
  );
}
