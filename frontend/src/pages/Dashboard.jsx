import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Book, Target, Activity, Users, Trash2, Zap } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const res = await axios.get('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAllUsers(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUsers();
    } else {
      const fetchProgress = async () => {
        try {
          const res = await axios.get('/api/progress', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProgress(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProgress();
    }
  }, [user, token]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(allUsers.filter(u => u._id !== id));
      alert('User deleted successfully.');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error deleting user');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your own account? This cannot be undone.')) return;
    try {
      await axios.delete('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Your account has been deleted.');
      logout();
    } catch {
      alert('Failed to delete account');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (user?.role === 'admin') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1>Admin Control Panel 🛡️</h1>
        <p style={{ marginBottom: '30px' }}>Sudo access - Manage all users internally.</p>

        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Users size={24} />
            </div>
            <h3 style={{ margin: 0 }}>All Registered Users</h3>
          </div>
          
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px' }}>Username</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>{u.username}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={u.role === 'admin' ? 'badge badge-hard' : 'badge badge-easy'}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {u._id !== user.id && (
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="btn btn-outline"
                        style={{ border: '1px solid var(--danger)', color: 'var(--danger)', padding: '6px 12px' }}
                      >
                         <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Welcome back, {user?.username} 👋</h1>
          <p style={{ marginBottom: '30px' }}>Here is your study overview for today.</p>
        </div>
        <button 
          onClick={handleDeleteAccount}
          className="btn"
          style={{ background: 'var(--danger)', color: 'white', padding: '10px 16px' }}
        >
          <Trash2 size={16} style={{ marginRight: '8px' }}/>
          Delete Account
        </button>
      </div>

      <div className="grid grid-3">
        <motion.div className="glass-panel" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Book size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Flashcards Reviewed</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{progress?.totalFlashcardsReviewed || 0}</h2>
        </motion.div>

        <motion.div className="glass-panel" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: 'var(--warning)' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Study Streak</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{progress?.streakDays || 0} Days</h2>
        </motion.div>

        <motion.div className="glass-panel" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
              <Target size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Completion Status</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{progress?.completionPercentage || 0}%</h2>
        </motion.div>

        <motion.div className="glass-panel" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.25 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Users size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Total Focus Time</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{progress?.totalStudyMinutes || 0}m</h2>
        </motion.div>

        <motion.div className="glass-panel" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: 'var(--danger)' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Weak Topics</h3>
          </div>
          <div>
            {progress?.weakTopics && progress.weakTopics.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {progress.weakTopics.map((topic, i) => (
                  <span key={i} className="badge badge-hard">{topic}</span>
                ))}
              </div>
            ) : (
              <p>No weak topics identified yet!</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
