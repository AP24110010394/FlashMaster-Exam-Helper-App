import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, Trash2, Edit3, X, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const NOTE_COLORS = [
  { key: 'purple', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', label: 'Purple' },
  { key: 'cyan', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.3)', label: 'Cyan' },
  { key: 'green', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', label: 'Green' },
  { key: 'orange', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', label: 'Orange' },
  { key: 'red', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', label: 'Red' },
];

const getColorStyle = (key) => NOTE_COLORS.find(c => c.key === key) || NOTE_COLORS[0];

const NotesPage = () => {
  const { token } = useContext(AuthContext);
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', color: 'purple' });
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openCreate = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', color: 'purple' });
    setShowForm(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content, color: note.color || 'purple' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingNote) {
        const res = await axios.put(
          `/api/notes/${editingNote._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes(prev => prev.map(n => n._id === res.data._id ? res.data : n));
        toast.success('Note updated!');
      } else {
        const res = await axios.post(
          '/api/notes',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes(prev => [res.data, ...prev]);
        toast.success('Note created!');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Failed to save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => prev.filter(n => n._id !== id));
      toast.success('Note deleted.');
    } catch {
      toast.error('Failed to delete note.');
    }
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="container"><h2>Loading notes...</h2></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <div>
          <h1>My Notes</h1>
          <p>Quick-capture ideas, summaries, and study notes.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ gap: '8px', marginTop: '8px' }}>
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Search */}
      {notes.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Search notes..."
            className="form-control"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>
      )}

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', color: 'var(--text-muted)' }}>
          <StickyNote size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <h3>{notes.length === 0 ? 'No notes yet' : 'No notes match your search'}</h3>
          {notes.length === 0 && (
            <p>Click "New Note" to capture your first idea!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-3">
          <AnimatePresence>
            {filtered.map((note, i) => {
              const colorStyle = getColorStyle(note.color);
              return (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    background: colorStyle.bg,
                    border: `1px solid ${colorStyle.border}`,
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  className="note-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      background: 'none',
                      WebkitTextFillColor: 'unset',
                      flex: 1,
                      paddingRight: '8px'
                    }}>{note.title}</h3>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button onClick={() => openEdit(note)} className="icon-btn" title="Edit"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(note._id)} className="icon-btn danger" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', flex: 1 }}>
                    {note.content.length > 200 ? note.content.slice(0, 200) + '...' : note.content}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                    {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '540px', width: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>{editingNote ? 'Edit Note' : 'New Note'}</h3>
                <button onClick={() => setShowForm(false)} className="icon-btn"><X size={18} /></button>
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Note title..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  placeholder="Write your note here..."
                  rows={6}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c.key}
                      onClick={() => setFormData({ ...formData, color: c.key })}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: c.bg, border: `2px solid ${formData.color === c.key ? c.border : 'transparent'}`,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {formData.color === c.key && <Check size={14} color="white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotesPage;
