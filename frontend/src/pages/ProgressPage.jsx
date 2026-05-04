import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PieChart, List, AlertTriangle, Flame, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ProgressPage = () => {
  const { token } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProgress();
  }, [token]);

  if (loading) return <div>Loading progress...</div>;

  const pct = progress?.completionPercentage || 0;
  const circumference = 2 * Math.PI * 70;
  const dashOffset = circumference * (1 - pct / 100);

  const formatStudyTime = (minutes) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="container">
      <h1>Your Progress Dashboard</h1>
      <p style={{ marginBottom: '40px' }}>Track your learning metrics and weak points over time.</p>

      {/* Streak + Study Time */}
      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(245,158,11,0.2)', borderRadius: '12px' }}>
              <Flame size={24} color="var(--warning)" />
            </div>
            <h3 style={{ margin: 0 }}>Study Streak</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{progress?.streakDays || 0}</h2>
          <p style={{ marginTop: '6px', fontSize: '0.85rem' }}>consecutive day{progress?.streakDays !== 1 ? 's' : ''}</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}>
              <List size={24} color="var(--primary)" />
            </div>
            <h3 style={{ margin: 0 }}>Cards Reviewed</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{progress?.totalFlashcardsReviewed || 0}</h2>
          <p style={{ marginTop: '6px', fontSize: '0.85rem' }}>total flashcards</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(6,182,212,0.2)', borderRadius: '12px' }}>
              <Clock size={24} color="var(--accent)" />
            </div>
            <h3 style={{ margin: 0 }}>Study Time</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{formatStudyTime(progress?.totalStudyMinutes)}</h2>
          <p style={{ marginTop: '6px', fontSize: '0.85rem' }}>via Pomodoro timer</p>
        </motion.div>
      </div>

      <div className="grid grid-2">
        {/* Completion Donut */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <PieChart size={28} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Study Plan Completion</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
            <div style={{ position: 'relative' }}>
              <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" />
                <circle
                  cx="90" cy="90" r="70"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{pct}%</h2>
                <p style={{ margin: 0, fontSize: '0.75rem' }}>Complete</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weak Topics */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ border: '1px solid rgba(239, 68, 68, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <AlertTriangle size={24} color="var(--danger)" />
            <h2 style={{ margin: 0 }}>Weak Areas</h2>
          </div>
          {progress?.weakTopics && progress.weakTopics.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {progress.weakTopics.map((topic, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px',
                  background: 'rgba(239,68,68,0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239,68,68,0.15)'
                }}>
                  <span style={{ color: 'var(--danger)', fontSize: '1rem' }}>⚠</span>
                  <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{topic}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--success)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</p>
              <p style={{ color: 'var(--success)', fontWeight: 600 }}>No weak areas identified yet!</p>
              <p style={{ fontSize: '0.85rem' }}>Review some flashcards and rate them "Hard" to see weak topics here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressPage;
