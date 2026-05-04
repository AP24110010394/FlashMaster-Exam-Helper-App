import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">📚</span> FlashMaster
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Home</Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/decks" className="nav-links">My Decks</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links logout-btn">Logout</button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
