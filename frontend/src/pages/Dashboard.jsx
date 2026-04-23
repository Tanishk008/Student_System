import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LogOut, Plus, Search, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ setIsAuth }) => {
  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGrievance, setCurrentGrievance] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Academic' });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchGrievances = async () => {
    try {
      const { data } = await api.get('/grievances');
      setGrievances(data);
    } catch (err) {
      toast.error('Failed to load grievances');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.get(`/grievances/search?title=${searchTerm}`);
      setGrievances(data);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentGrievance) {
        await api.put(`/grievances/${currentGrievance._id}`, formData);
        toast.success('Grievance updated');
      } else {
        await api.post('/grievances', formData);
        toast.success('Grievance submitted');
      }
      setIsModalOpen(false);
      setCurrentGrievance(null);
      setFormData({ title: '', description: '', category: 'Academic' });
      fetchGrievances();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await api.delete(`/grievances/${id}`);
        toast.success('Grievance deleted');
        fetchGrievances();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const openEdit = (g) => {
    setCurrentGrievance(g);
    setFormData({ title: g.title, description: g.description, category: g.category });
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuth(false);
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Student Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="btn-primary" style={{ background: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Actions Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search by title..."
            className="input-field"
            style={{ marginBottom: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> Search
          </button>
        </form>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Grievance
        </button>
      </div>

      {/* Grievance List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {grievances.map((g) => (
            <motion.div
              key={g._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card"
              style={{ position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className={`status-badge status-${g.status?.toLowerCase() || 'pending'}`}>{g.status || 'Pending'}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Edit2 size={16} className="text-muted" style={{ cursor: 'pointer' }} onClick={() => openEdit(g)} />
                  <Trash2 size={16} style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDelete(g._id)} />
                </div>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{g.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{g.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>
                <AlertCircle size={14} /> {g.category}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '1rem' }}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{currentGrievance ? 'Edit Grievance' : 'Submit New Grievance'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                className="input-field"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="input-field"
                style={{ height: '100px', resize: 'none' }}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {currentGrievance ? 'Update' : 'Submit'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
