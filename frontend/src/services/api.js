import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to headers if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, password, username) => apiClient.post('/auth/register', { email, password, username }),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile')
};

export const deckService = {
  getUserDecks: () => apiClient.get('/decks'),
  createDeck: (name, description) => apiClient.post('/decks', { name, description }),
  getDeckDetails: (deckId) => apiClient.get(`/decks/${deckId}`),
  updateDeck: (deckId, data) => apiClient.put(`/decks/${deckId}`, data),
  deleteDeck: (deckId) => apiClient.delete(`/decks/${deckId}`)
};

export const flashcardService = {
  getCardsByDeck: (deckId) => apiClient.get(`/flashcards/deck/${deckId}`),
  createCard: (deckId, front, back) => apiClient.post('/flashcards', { deckId, front, back }),
  updateCard: (cardId, front, back) => apiClient.put(`/flashcards/${cardId}`, { front, back }),
  deleteCard: (cardId) => apiClient.delete(`/flashcards/${cardId}`)
};

export const studyService = {
  startSession: (deckId) => apiClient.post('/study/session', { deckId }),
  recordReview: (sessionId, cardId, difficulty) => apiClient.post('/study/review', { sessionId, cardId, difficulty }),
  getStats: () => apiClient.get('/study/stats')
};

export default apiClient;
