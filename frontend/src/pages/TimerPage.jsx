import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Timer, Coffee, SkipForward, RotateCcw, Play, Pause, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const MODES = {
  work: { label: 'Focus', minutes: 25, color: 'var(--primary)' },
  shortBreak: { label: 'Short Break', minutes: 5, color: 'var(--success)' },
  longBreak: { label: 'Long Break', minutes: 15, color: 'var(--accent)' },
};

const TimerPage = () => {
  const { token } = useContext(AuthContext);
  const toast = useToast();
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(MODES.work.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const intervalRef = React.useRef(null);

  const totalSeconds = customMinutes
    ? parseInt(customMinutes) * 60
    : MODES[mode].minutes * 60;

  const progress = 1 - secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 110;
  const dashOffset = circumference * (1 - progress);

  const logTime = useCallback(async (minutes) => {
    try {
      await axios.post(
        '/api/flashcards/log-time',
        { minutes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to log time:', err.message);
    }
  }, [token]);

  const tick = useCallback(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        const mins = MODES[mode].minutes;
        if (mode === 'work') {
          setSessions(s => s + 1);
          setTotalMinutes(t => {
            const newTotal = t + mins;
            logTime(mins);
            return newTotal;
          });
          toast.success('Focus session complete! Time for a break 🎉');
        } else {
          toast.info('Break over! Ready to focus again?');
        }
        return 0;
      }
      return prev - 1;
    });
  }, [mode, logTime, toast]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const switchMode = (newMode) => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setMode(newMode);
    setCustomMinutes('');
    setSecondsLeft(MODES[newMode].minutes * 60);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSecondsLeft(customMinutes ? parseInt(customMinutes) * 60 : MODES[mode].minutes * 60);
  };

  const skip = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    const nextMode = mode === 'work' ? (sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak') : 'work';
    switchMode(nextMode);
  };

  const applyCustom = () => {
    const mins = parseInt(customMinutes);
    if (!mins || mins < 1 || mins > 120) {
      toast.error('Enter a valid duration between 1-120 minutes');
      return;
    }
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSecondsLeft(mins * 60);
  };

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');
  const currentColor = MODES[mode].color;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <h1>Study Timer</h1>
      <p style={{ marginBottom: '40px' }}>Stay focused with Pomodoro technique. 25 min work · 5 min break.</p>

      {/* Mode Selector */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`btn ${mode === key ? 'btn-primary' : 'btn-outline'}`}
            style={mode === key ? { background: val.color, borderColor: val.color } : {}}
          >
            {key === 'work' && <Timer size={16} style={{ marginRight: '6px' }} />}
            {key !== 'work' && <Coffee size={16} style={{ marginRight: '6px' }} />}
            {val.label} ({val.minutes}m)
          </button>
        ))}
      </div>

      {/* Timer Ring */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
        <div style={{ position: 'relative', width: '260px', height: '260px' }}>
          <svg width="260" height="260" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
            <circle
              cx="130" cy="130" r="110"
              fill="none"
              stroke={currentColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1 }}>
              {minutes}:{seconds}
            </div>
            <div style={{ color: currentColor, fontWeight: 600, marginTop: '6px', fontSize: '0.9rem' }}>
              {MODES[mode].label}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={reset} className="btn btn-outline" style={{ padding: '12px 16px' }} title="Reset">
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => setIsRunning(r => !r)}
            className="btn btn-primary"
            style={{ padding: '16px 40px', fontSize: '1.1rem', background: currentColor, borderColor: currentColor, minWidth: '140px' }}
          >
            {isRunning ? <><Pause size={22} style={{ marginRight: '8px' }} />Pause</> : <><Play size={22} style={{ marginRight: '8px' }} />Start</>}
          </button>
          <button onClick={skip} className="btn btn-outline" style={{ padding: '12px 16px' }} title="Skip">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Custom Duration */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Custom mins"
            value={customMinutes}
            onChange={e => setCustomMinutes(e.target.value)}
            className="form-control"
            style={{ width: '140px' }}
            min="1"
            max="120"
          />
          <button onClick={applyCustom} className="btn btn-outline">Set</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-3" style={{ marginTop: '60px' }}>
        <motion.div className="glass-panel" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <CheckCircle size={22} color="var(--success)" />
            <h3 style={{ margin: 0 }}>Sessions Today</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{sessionsCompleted}</h2>
        </motion.div>

        <motion.div className="glass-panel" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Timer size={22} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Focus Time</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{totalMinutes}m</h2>
        </motion.div>

        <motion.div className="glass-panel" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Coffee size={22} color="var(--accent)" />
            <h3 style={{ margin: 0 }}>Breaks Taken</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{Math.max(0, sessionsCompleted - 1 + (mode !== 'work' && isRunning ? 1 : 0))}</h2>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimerPage;
