import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar, Zap, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const StudyPlanPage = () => {
  const { token } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [mode, setMode] = useState('AI'); // 'AI' or 'Manual'
  const [formData, setFormData] = useState({ 
    examDate: '', 
    subjects: '', 
    topics: '', 
    dailyStudyHours: '',
    materialId: '' 
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (token) {
      fetchPlan();
      fetchMaterials();
    }
  }, [token]);

  const fetchPlan = async () => {
    try {
      const res = await axios.get('/api/studyplan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('/api/materials', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, materialId: res.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (mode === 'Manual' && (!formData.subjects || !formData.topics)) {
        return alert('Please enter subjects and topics');
    }
    if (mode === 'AI' && !formData.materialId) {
        return alert('Please select a study material');
    }

    setGenerating(true);
    try {
      const endpoint = mode === 'AI' ? '/api/studyplan/generate' : '/api/studyplan';
      const payload = mode === 'AI' ? {
        materialId: formData.materialId,
        examDate: formData.examDate,
        dailyStudyHours: Number(formData.dailyStudyHours)
      } : {
        examDate: formData.examDate,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
        topics: formData.topics.split(',').map(s => s.trim()).filter(t => t),
        dailyStudyHours: Number(formData.dailyStudyHours)
      };

      const res = await axios.post(endpoint, payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setPlan(res.data);
      setFormData({ examDate: '', subjects: '', topics: '', dailyStudyHours: '', materialId: formData.materialId });
      alert(mode === 'AI' ? 'AI Study Plan Generated!' : 'Manual Study Plan Created!');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Failed to create plan';
      alert(msg);
    } finally {
      setGenerating(false);
    }
  };

  const deletePlan = async () => {
    if (!window.confirm('Are you sure you want to delete your current study plan?')) return;
    try {
        // Since we only store one recent plan for now, we'll just set it to null in state manually
        // If we want a real delete route: axios.delete(`/api/studyplan/${plan._id}`)
        setPlan(null);
    } catch (err) {
        console.error(err);
    }
  };

  const toggleTopic = async (topicId) => {
    try {
      await axios.put(
        `/api/studyplan/${plan._id}/topic/${topicId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPlan();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={32} color="var(--primary)" />
            <h1 style={{ margin: 0 }}>Study Plan</h1>
        </div>
        {plan && (
            <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={deletePlan}>
                <Trash2 size={16} style={{ marginRight: '8px' }} />
                Delete Plan
            </button>
        )}
      </div>

      {!plan ? (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
                className={`btn ${mode === 'AI' ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => setMode('AI')}
                style={{ flex: 1, gap: '8px' }}
            >
                <Zap size={16} /> AI Generate
            </button>
            <button 
                className={`btn ${mode === 'Manual' ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => setMode('Manual')}
                style={{ flex: 1, gap: '8px' }}
            >
                <Edit3 size={16} /> Manual Input
            </button>
          </div>

          <h2>{mode === 'AI' ? 'Generate AI Study Plan' : 'Create Custom Plan'}</h2>
          
          <form onSubmit={handleCreatePlan}>
            <div className="form-group">
              <label className="form-label">Exam Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={formData.examDate}
                required 
                onChange={e => setFormData({...formData, examDate: e.target.value})} 
              />
            </div>

            {mode === 'AI' ? (
                <div className="form-group">
                    <label className="form-label">Select Study Material</label>
                    <select 
                        className="form-control" 
                        value={formData.materialId}
                        required
                        onChange={e => setFormData({...formData, materialId: e.target.value})}
                    >
                        {materials.length === 0 && <option value="">No materials found. Upload some first!</option>}
                        {materials.map(m => (
                            <option key={m._id} value={m._id}>{m.filename}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <>
                    <div className="form-group">
                        <label className="form-label">Subjects (comma separated)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Math, Physics" 
                            value={formData.subjects}
                            required 
                            onChange={e => setFormData({...formData, subjects: e.target.value})} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Topics (comma separated)</label>
                        <textarea 
                            className="form-control" 
                            placeholder="e.g. Algebra, Kinematics" 
                            value={formData.topics}
                            required 
                            rows={3} 
                            onChange={e => setFormData({...formData, topics: e.target.value})} 
                        />
                    </div>
                </>
            )}

            <div className="form-group">
              <label className="form-label">Daily Study Hours</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.dailyStudyHours}
                required 
                min="1" 
                max="16" 
                onChange={e => setFormData({...formData, dailyStudyHours: e.target.value})} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '8px' }} disabled={generating}>
              {generating ? (
                  <>Processing AI Data...</>
              ) : (
                  <>{mode === 'AI' ? <Zap size={18} /> : null} {mode === 'AI' ? 'Generate AI Timeline' : 'Create Plan'}</>
              )}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-panel" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ margin: 0 }}>Target Exam: {new Date(plan.examDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Commitment: {plan.dailyStudyHours} hours per day</p>
            </div>
            <div className="badge badge-easy" style={{ padding: '8px 16px' }}>
                {plan.topics.filter(t => t.completed).length} / {plan.topics.length} Topics Done
            </div>
          </div>

          <div className="grid grid-2">
            <AnimatePresence>
                {plan.topics.map((topic, i) => (
                <motion.div 
                    key={topic._id} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel" 
                    style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderLeft: topic.completed ? '5px solid var(--success)' : '5px solid var(--warning)',
                    background: topic.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--glass-bg)'
                    }}
                >
                    <div>
                    <h4 style={{ 
                        margin: 0,
                        textDecoration: topic.completed ? 'line-through' : 'none', 
                        color: topic.completed ? 'var(--text-muted)' : 'var(--text-main)' 
                    }}>
                        {topic.name}
                    </h4>
                    <small style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Calendar size={12} /> {new Date(topic.dateAssigned).toLocaleDateString()}
                    </small>
                    </div>
                    <button 
                    className={topic.completed ? "btn btn-outline" : "btn btn-primary"}
                    onClick={() => toggleTopic(topic._id)}
                    style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                    {topic.completed ? 'Done' : 'Mark Done'}
                    </button>
                </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudyPlanPage;
