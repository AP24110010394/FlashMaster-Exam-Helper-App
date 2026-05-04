import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Decks from './pages/Decks';
import Study from './pages/Study';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/study/:deckId" element={<Study />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
