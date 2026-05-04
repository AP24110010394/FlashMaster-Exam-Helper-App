import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, Trash2, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const UploadPage = () => {
  const { token } = useContext(AuthContext);
  const toast = useToast();

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [material, setMaterial] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [cards, setCards] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [previewText, setPreviewText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('/api/materials', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(selectedFile.type)) {
      toast.error('Only PDF and TXT files are allowed');
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 100MB.');
      return;
    }
    setFile(selectedFile);
    setMaterial(null);
    setCards([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFileChange(dropped);
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first.');
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setUploadProgress(0);

    try {
      const res = await axios.post('/api/materials/upload', formData, {
        timeout: 600000, // 10 minutes
        headers: {
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        }
      });
      setMaterial(res.data);
      setFile(null);
      toast.success(`"${res.data.filename}" uploaded successfully!`);
      fetchMaterials();
    } catch (err) {
      const msg = err.response?.data?.msg || 'Upload failed. Please try again.';
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const generateFlashcards = async () => {
    if (!material) return;
    setGenerating(true);
    try {
      const res = await axios.post(
        '/api/flashcards/generate',
        { materialId: material._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCards(res.data);
      toast.success(`${res.data.length} flashcards generated!`);
    } catch (err) {
      toast.error('Flashcard generation failed. Check your Gemini API key.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteMaterial = async (id, filename) => {
    if (!window.confirm(`Delete "${filename}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(prev => prev.filter(m => m._id !== id));
      if (material?._id === id) setMaterial(null);
      toast.success('Material deleted.');
    } catch (err) {
      toast.error('Failed to delete material.');
    }
  };

  const handlePreview = async (id) => {
    try {
      const res = await axios.get(`/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreviewText(res.data.extractedText);
      setShowPreview(true);
    } catch {
      toast.error('Could not load preview.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <h1>Upload Study Materials</h1>

      <div className="grid grid-2" style={{ marginBottom: '40px' }}>
        {/* Upload Zone */}
        <div className="glass-panel">
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => handleFileChange(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <UploadCloud size={52} color={isDragging ? 'var(--accent)' : 'var(--primary)'} style={{ marginBottom: '16px', transition: 'color 0.3s' }} />
            {file ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: '1rem' }}>📄 {file.name}</p>
                <p style={{ fontSize: '0.85rem' }}>{formatFileSize(file.size)}</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '8px' }}>{isDragging ? 'Drop it here!' : 'Drag & Drop your file'}</h3>
                <p style={{ marginBottom: '0' }}>or click to browse · PDF or TXT · max 100MB</p>
              </>
            )}
          </div>

          {file && (
            <div style={{ marginTop: '16px' }}>
              {loading && (
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  <span className="progress-bar-label">{uploadProgress}%</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button className="btn btn-primary" onClick={handleUpload} disabled={loading} style={{ flex: 1 }}>
                  {loading ? `Uploading ${uploadProgress}%...` : 'Upload File'}
                </button>
                <button className="btn btn-outline" onClick={() => setFile(null)} disabled={loading} style={{ padding: '10px 16px' }}>
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post-Upload Actions */}
        <AnimatePresence>
          {material && (
            <motion.div className="glass-panel" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <CheckCircle size={28} color="var(--success)" />
                <h3 style={{ margin: 0 }}>Upload Successful!</h3>
              </div>
              <p><strong>File:</strong> {material.filename}</p>
              <p><strong>Extracted:</strong> {material.extractedText?.length?.toLocaleString()} characters</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                Text has been extracted and saved. You can now generate AI flashcards.
              </p>
              <button
                className="btn btn-primary"
                onClick={generateFlashcards}
                disabled={generating}
                style={{ width: '100%', marginTop: '20px', gap: '8px' }}
              >
                <Zap size={18} />
                {generating ? 'AI is generating cards...' : 'Generate AI Flashcards'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Generated Cards Preview */}
      {cards.length > 0 && (
        <motion.div className="glass-panel" style={{ marginBottom: '40px' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CheckCircle size={24} color="var(--success)" />
            <h3 style={{ margin: 0 }}>{cards.length} Flashcards Generated & Saved</h3>
            <a href="/flashcards" style={{ marginLeft: 'auto', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
              Start Reviewing →
            </a>
          </div>
          <div className="grid grid-3">
            {cards.slice(0, 6).map((card, idx) => (
              <div key={idx} style={{ padding: '15px', background: 'rgba(139,92,246,0.08)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.2)' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Q: {card.question}</p>
                <p style={{ fontSize: '0.85rem' }}>A: {card.answer}</p>
              </div>
            ))}
          </div>
          {cards.length > 6 && <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)' }}>+ {cards.length - 6} more cards saved</p>}
        </motion.div>
      )}

      {/* Materials Library */}
      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <FileText size={24} color="var(--accent)" />
          <h2 style={{ margin: 0 }}>My Materials Library</h2>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{materials.length} file{materials.length !== 1 ? 's' : ''}</span>
        </div>

        {loadingMaterials ? (
          <p>Loading materials...</p>
        ) : materials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <UploadCloud size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p>No materials uploaded yet. Upload your first file above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {materials.map((m) => (
              <motion.div
                key={m._id}
                className="material-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div className="file-type-badge">{m.type.includes('pdf') ? 'PDF' : 'TXT'}</div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>{m.filename}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {m.fileSize ? ` · ${formatFileSize(m.fileSize)}` : ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => { setMaterial(m); setCards([]); window.scrollTo(0, 0); }}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
                    title="Generate flashcards from this material"
                  >
                    <Zap size={14} /> Use
                  </button>
                  <button
                    onClick={() => handlePreview(m._id)}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    title="Preview extracted text"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteMaterial(m._id, m.filename)}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Text Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Extracted Text Preview</h3>
                <button className="btn btn-outline" onClick={() => setShowPreview(false)} style={{ padding: '4px 10px' }}>✕</button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
                {previewText || 'No extracted text available.'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadPage;
