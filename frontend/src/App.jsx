import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import FlashcardsPage from './pages/FlashcardsPage';
import StudyPlanPage from './pages/StudyPlanPage';
import ProgressPage from './pages/ProgressPage';
import TimerPage from './pages/TimerPage';
import NotesPage from './pages/NotesPage';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <Navbar />
        <div className="container" style={{ paddingBottom: '60px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Navigate to="/login" />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
            <Route path="/flashcards" element={<PrivateRoute><FlashcardsPage /></PrivateRoute>} />
            <Route path="/studyplan" element={<PrivateRoute><StudyPlanPage /></PrivateRoute>} />
            <Route path="/studyplay" element={<Navigate to="/studyplan" />} />
            <Route path="/progress" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
            <Route path="/timer" element={<PrivateRoute><TimerPage /></PrivateRoute>} />
            <Route path="/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
