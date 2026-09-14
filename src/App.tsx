import { useState, useEffect } from 'react';

interface Card {
  id: string;
  front: string;
  back: string;
}

interface Deck {
  id: string;
  name: string;
  cards: Card[];
}

type View = 'decks' | 'cards' | 'study';

export default function App() {
  const [decks, setDecks] = useState<Deck[]>(() => {
    const saved = localStorage.getItem('flashcard-decks');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentDeck, setCurrentDeck] = useState<string | null>(null);
  const [view, setView] = useState<View>('decks');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('flashcard-dark');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem('flashcard-dark', JSON.stringify(darkMode));
  }, [darkMode]);

  const createDeck = (name: string) => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      name,
      cards: [],
    };
    setDecks([...decks, newDeck]);
  };

  const deleteDeck = (id: string) => {
    setDecks(decks.filter(d => d.id !== id));
    if (currentDeck === id) {
      setCurrentDeck(null);
      setView('decks');
    }
  };

  const addCard = (deckId: string, front: string, back: string) => {
    setDecks(decks.map(d => {
      if (d.id === deckId) {
        return {
          ...d,
          cards: [...d.cards, { id: Date.now().toString(), front, back }]
        };
      }
      return d;
    }));
  };

  const deleteCard = (deckId: string, cardId: string) => {
    setDecks(decks.map(d => {
      if (d.id === deckId) {
        return { ...d, cards: d.cards.filter(c => c.id !== cardId) };
      }
      return d;
    }));
  };

  const openDeck = (deckId: string) => {
    setCurrentDeck(deckId);
    setView('cards');
  };

  const startStudy = () => {
    setView('study');
  };

  const goBack = () => {
    if (view === 'study') {
      setView('cards');
    } else if (view === 'cards') {
      setView('decks');
      setCurrentDeck(null);
    }
  };

  const currentDeckData = decks.find(d => d.id === currentDeck);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/70 border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== 'decks' && (
              <button
                onClick={goBack}
                className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                ←
              </button>
            )}
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flashcard Maker
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-all ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {view === 'decks' && (
          <DecksView
            decks={decks}
            onCreateDeck={createDeck}
            onDeleteDeck={deleteDeck}
            onOpenDeck={openDeck}
            darkMode={darkMode}
          />
        )}
        {view === 'cards' && currentDeckData && (
          <CardsView
            deck={currentDeckData}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onStartStudy={startStudy}
            darkMode={darkMode}
          />
        )}
        {view === 'study' && currentDeckData && (
          <StudyView
            deck={currentDeckData}
            darkMode={darkMode}
          />
        )}
      </main>
    </div>
  );
}

// Decks View
interface DecksViewProps {
  decks: Deck[];
  onCreateDeck: (name: string) => void;
  onDeleteDeck: (id: string) => void;
  onOpenDeck: (id: string) => void;
  darkMode: boolean;
}

function DecksView({ decks, onCreateDeck, onDeleteDeck, onOpenDeck, darkMode }: DecksViewProps) {
  const [newDeckName, setNewDeckName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    onCreateDeck(newDeckName.trim());
    setNewDeckName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Decks
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Create flashcard decks to study anything
        </p>
      </div>

      {/* Create Deck Form */}
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
          placeholder="New deck name..."
          className={`flex-1 px-4 py-3 rounded-xl text-sm ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Create
        </button>
      </form>

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="text-6xl mb-4">📚</div>
          <p>No decks yet. Create your first deck above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className={`group relative p-6 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  : 'bg-white hover:shadow-xl border border-gray-100'
              }`}
              onClick={() => onOpenDeck(deck.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">📖</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this deck?')) onDeleteDeck(deck.id);
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                  }`}
                >
                  🗑️
                </button>
              </div>
              <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {deck.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Cards View
interface CardsViewProps {
  deck: Deck;
  onAddCard: (deckId: string, front: string, back: string) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
  onStartStudy: () => void;
  darkMode: boolean;
}

function CardsView({ deck, onAddCard, onDeleteCard, onStartStudy, darkMode }: CardsViewProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onAddCard(deck.id, front.trim(), back.trim());
    setFront('');
    setBack('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {deck.name}
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'} in this deck
        </p>
      </div>

      {/* Add Card Form */}
      <form onSubmit={handleAdd} className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Add New Card
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Front (question/term)..."
            className={`w-full px-4 py-3 rounded-xl text-sm ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
          <input
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back (answer/definition)..."
            className={`w-full px-4 py-3 rounded-xl text-sm ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            + Add Card
          </button>
        </div>
      </form>

      {/* Cards List */}
      {deck.cards.length > 0 && (
        <>
          <div className="space-y-3">
            {deck.cards.map((card, index) => (
              <div
                key={card.id}
                className={`group p-4 rounded-xl transition-all ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' : 'bg-white hover:shadow-md border border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div>
                      <span className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Q:
                      </span>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {card.front}
                      </p>
                    </div>
                    <div>
                      <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        A:
                      </span>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {card.back}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this card?')) onDeleteCard(deck.id, card.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all flex-shrink-0 ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Study Button */}
          <button
            onClick={onStartStudy}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
          >
            🎯 Start Studying ({deck.cards.length} cards)
          </button>
        </>
      )}
    </div>
  );
}

// Study View
interface StudyViewProps {
  deck: Deck;
  darkMode: boolean;
}

function StudyView({ deck, darkMode }: StudyViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

  const currentCard = deck.cards[currentIndex];
  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const markKnown = () => {
    setKnownCards(new Set([...knownCards, currentCard.id]));
    nextCard();
  };

  const markUnknown = () => {
    setKnownCards(new Set([...knownCards].filter(id => id !== currentCard.id)));
    nextCard();
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
  };

  if (!currentCard) return null;

  const isComplete = currentIndex === deck.cards.length - 1 && isFlipped;

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Studying: {deck.name}
        </h2>
        <div className="flex items-center gap-3">
          <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentIndex + 1} / {deck.cards.length}
          </span>
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="relative h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className={`absolute inset-0 p-8 rounded-2xl flex items-center justify-center backface-hidden ${
            darkMode
              ? 'bg-gradient-to-br from-blue-600 to-purple-600'
              : 'bg-gradient-to-br from-blue-500 to-purple-500'
          } shadow-2xl`}>
            <div className="text-center">
              <div className="text-xs font-medium text-white/70 mb-4 uppercase tracking-wider">
                Question
              </div>
              <div className="text-2xl font-bold text-white">
                {currentCard.front}
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={`absolute inset-0 p-8 rounded-2xl flex items-center justify-center backface-hidden rotate-y-180 ${
            darkMode
              ? 'bg-gradient-to-br from-green-600 to-emerald-600'
              : 'bg-gradient-to-br from-green-500 to-emerald-500'
          } shadow-2xl`}>
            <div className="text-center">
              <div className="text-xs font-medium text-white/70 mb-4 uppercase tracking-wider">
                Answer
              </div>
              <div className="text-2xl font-bold text-white">
                {currentCard.back}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {!isComplete ? (
        <div className="space-y-4">
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isFlipped ? 'How well did you know this?' : 'Click the card to flip it'}
          </p>

          {isFlipped && (
            <div className="flex gap-3">
              <button
                onClick={markUnknown}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all"
              >
                ❌ Still Learning
              </button>
              <button
                onClick={markKnown}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                ✅ Got It!
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                currentIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              ← Previous
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex === deck.cards.length - 1}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                currentIndex === deck.cards.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div className={`text-center p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <div className="text-6xl mb-4">🎉</div>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Session Complete!
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You knew {knownCards.size} out of {deck.cards.length} cards
          </p>
          <button
            onClick={restart}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            🔄 Study Again
          </button>
        </div>
      )}
    </div>
  );
}
