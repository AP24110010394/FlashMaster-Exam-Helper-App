import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?';

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/upload', label: 'Upload' },
    { to: '/flashcards', label: 'Flashcards' },
    { to: '/studyplan', label: 'Study Plan' },
    { to: '/progress', label: 'Progress' },
    { to: '/timer', label: 'Timer' },
    { to: '/notes', label: 'Notes' },
  ];

  return (
    <nav className="navbar container">
      <Link to="/" className="nav-brand">
        <BookOpen size={24} color="var(--primary)" />
        <span>FLASHMASTER</span>
      </Link>

      {user ? (
        <div className="nav-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${isActive(link.to) ? ' active' : ''}`}
            >
              {link.label}
              {isActive(link.to) && <span className="nav-active-dot" />}
            </Link>
          ))}

          <div className="nav-user">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{user.username}</span>
            <button className="btn btn-outline nav-logout" onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
