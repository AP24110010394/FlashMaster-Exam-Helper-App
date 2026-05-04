import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to FlashMaster</h1>
        <p className="hero-subtitle">Learn Smarter, Not Harder</p>
        <p className="hero-description">
          Create flashcard decks, study efficiently, and master your exams with spaced repetition.
        </p>
        {!isLoggedIn ? (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        ) : (
          <Link to="/decks" className="btn btn-primary">Go to My Decks</Link>
        )}
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📝 Create Decks</h3>
            <p>Organize your study materials into custom decks</p>
          </div>
          <div className="feature-card">
            <h3>🎯 Smart Study</h3>
            <p>Spaced repetition algorithm optimizes learning</p>
          </div>
          <div className="feature-card">
            <h3>📊 Track Progress</h3>
            <p>Monitor your learning with detailed statistics</p>
          </div>
          <div className="feature-card">
            <h3>🚀 Fast & Easy</h3>
            <p>Simple interface for quick and effective studying</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
