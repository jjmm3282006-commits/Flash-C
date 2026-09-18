import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.href = '/flashcard.html';
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <p>Redirecting to Flashcard Maker...</p>
    </div>
  );
}
