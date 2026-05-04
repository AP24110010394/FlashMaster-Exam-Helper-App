import React, { useState, useEffect } from 'react';
import { deckService, flashcardService } from '../services/api';
import '../styles/Decks.css';

function Decks() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDeckName, setNewDeckName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await deckService.getUserDecks();
      setDecks(response.data.decks || []);
    } catch (err) {
      console.error('Failed to fetch decks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    try {
      await deckService.createDeck(newDeckName, '');
      setNewDeckName('');
      setShowForm(false);
      fetchDecks();
    } catch (err) {
      console.error('Failed to create deck:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="decks-page">
      <h1>My Decks</h1>
      
      {showForm && (
        <form onSubmit={handleCreateDeck} className="create-deck-form">
          <input 
            type="text" 
            value={newDeckName} 
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="Enter deck name"
            required
          />
          <button type="submit" className="btn btn-primary">Create</button>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
        </form>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          + New Deck
        </button>
      )}

      <div className="decks-grid">
        {decks.map(deck => (
          <div key={deck.id} className="deck-card">
            <h3>{deck.name}</h3>
            <p className="card-count">{deck.cardCount} cards</p>
            <button className="btn btn-small">Study</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Decks;
