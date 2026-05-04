import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const FlashcardsPage = () => {
  const { token } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get('/api/flashcards', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter cards that are due for review (nextReviewDate <= today) or unrated
        const now = new Date();
        const dueCards = res.data.filter(c => new Date(c.nextReviewDate) <= now || c.difficulty === 'unrated');
        setCards(dueCards);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCards();
  }, [token]);

  const handleDifficulty = async (difficulty) => {
    const card = cards[currentIndex];
    if (!card) return;

    try {
      await axios.put(`/api/flashcards/${card._id}`, { difficulty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Move to next card
      setShowAnswer(false);
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to save progress.');
    }
  };

  if (loading) return <div className="container"><h2>Loading your cards...</h2></div>;

  if (currentIndex >= cards.length) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel">
          {cards.length === 0 ? (
            <>
                <h1 style={{ color: 'var(--primary)' }}>📚 No Cards Available</h1>
                <p>You haven't generated any flashcards yet. Go to <a href="/upload" style={{ color: 'var(--primary)' }}>Upload</a> to start!</p>
            </>
          ) : (
            <>
                <h1 style={{ color: 'var(--success)' }}>🎉 Review Complete!</h1>
                <p>You've reviewed all cards due for today. Great job!</p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Check Again</button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Review Session</h2>
        <span className="badge badge-medium">Card {currentIndex + 1} of {cards.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard._id + (showAnswer ? '-a' : '-q')}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.3 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: '600px', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: !showAnswer ? 'pointer' : 'default', padding: '40px' }}
          onClick={() => !showAnswer && setShowAnswer(true)}
        >
          {!showAnswer ? (
            <>
              <h3 style={{ color: 'var(--text-muted)' }}>Question</h3>
              <h2 style={{ textAlign: 'center', marginTop: '20px' }}>{currentCard.question}</h2>
              <p style={{ marginTop: 'auto', fontSize: '0.9rem', color: 'var(--primary)' }}>(Click to reveal answer)</p>
            </>
          ) : (
            <>
              <h3 style={{ color: 'var(--text-muted)' }}>Answer</h3>
              <h2 style={{ textAlign: 'center', marginTop: '20px', color: 'var(--accent)' }}>{currentCard.answer}</h2>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', gap: '16px', marginTop: '30px', width: '100%', maxWidth: '600px' }}
        >
          <button className="btn" style={{ flex: 1, background: 'var(--danger)', color: 'white' }} onClick={() => handleDifficulty('hard')}>
            Hard
          </button>
          <button className="btn" style={{ flex: 1, background: 'var(--warning)', color: 'white' }} onClick={() => handleDifficulty('medium')}>
            Medium
          </button>
          <button className="btn" style={{ flex: 1, background: 'var(--success)', color: 'white' }} onClick={() => handleDifficulty('easy')}>
            Easy
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FlashcardsPage;
