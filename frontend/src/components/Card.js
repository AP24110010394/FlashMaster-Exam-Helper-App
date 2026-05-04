import React from 'react';
import '../styles/Card.css';

function Card({ front, back, onClick }) {
  return (
    <div className="flashcard" onClick={onClick}>
      <div className="card-content">
        <p className="card-text">{front}</p>
      </div>
    </div>
  );
}

export default Card;
