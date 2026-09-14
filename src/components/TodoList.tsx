import { useState, useEffect, useRef } from 'react';

interface TodoListProps {
  darkMode: boolean;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoList({ darkMode }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos(prev => [
      { id: Date.now().toString(), text: input.trim(), completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput('');
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className={`rounded-2xl p-6 h-full transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700'
        : 'bg-white shadow-lg shadow-purple-100/50 border border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✅</span>
          <h3 className={`font-semibold text-sm uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Tasks
          </h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          {activeCount} remaining
        </span>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all active:scale-95"
        >
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700'
                : darkMode
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {todos.some(t => t.completed) && (
          <button
            onClick={clearCompleted}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'
            }`}
          >
            Clear done
          </button>
        )}
      </div>

      {/* Todo List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <p className={`text-center py-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  todo.completed
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-transparent'
                    : darkMode
                      ? 'border-gray-600 hover:border-blue-500'
                      : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {todo.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-sm transition-all ${
                todo.completed
                  ? darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
                  : ''
              }`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all ${
                  darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
