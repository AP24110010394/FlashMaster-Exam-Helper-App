import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { flashcardService, studyService } from '../services/api';
import Card from '../components/Card';
import '../styles/Study.css';

function Study() {
  const { deckId } = useParams();
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCards();
    fetchStats();
  }, [deckId]);

  const fetchCards = async () => {
    try {
      const response = await flashcardService.getCardsByDeck(deckId);
      setCards(response.data.cards || []);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await studyService.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  if (!cards.length) return <div className="loading">Loading cards...</div>;

  const card = cards[currentCard];

  return (
    <div className="study-page">
      <h1>Study Mode</h1>
      
      {stats && (
        <div className="stats-bar">
          <span>Accuracy: {stats.accuracy}%</span>
          <span>Studied: {stats.cardsStudied}/{stats.totalCards}</span>
          <span>Streak: {stats.streakDays} days</span>
        </div>
      )}

      <div className="study-container">
        <div className="card-display">
          <Card 
            front={isFlipped ? card.back : card.front}
            onClick={handleCardClick}
          />
          <p className="flip-hint">{isFlipped ? 'Answer' : 'Question'}</p>
        </div>

        <div className="study-controls">
          <button onClick={handlePrevious} disabled={currentCard === 0} className="btn">
            ← Previous
          </button>
          <span className="card-counter">
            {currentCard + 1} / {cards.length}
          </span>
          <button onClick={handleNext} disabled={currentCard === cards.length - 1} className="btn">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Study;
