import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getAllMovies, createMovie, updateMovie, deleteMovie } from '../services/movieService';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineFilm, HiOutlineTicket, HiOutlineShieldCheck } from 'react-icons/hi';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '', genre: '', duration: '', description: '', posterUrl: '', rating: '', language: 'English',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchMovies();
  }, [user, navigate]);

  const fetchMovies = async () => {
    try {
      const { data } = await getAllMovies();
      setMovies(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration),
        rating: parseFloat(formData.rating) || 0,
      };

      if (editing) {
        await updateMovie(editing, payload);
        toast.success('Movie updated!');
      } else {
        await createMovie(payload);
        toast.success('Movie added! 🎬');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ title: '', genre: '', duration: '', description: '', posterUrl: '', rating: '', language: 'English' });
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (movie) => {
    setEditing(movie._id);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      description: movie.description,
      posterUrl: movie.posterUrl,
      rating: movie.rating,
      language: movie.language || 'English',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      toast.success('Movie deleted');
      fetchMovies();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px',
          }}>
            <HiOutlineShieldCheck size={24} color="#f59e0b" />
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800,
            }}>
              <span className="gradient-text">Admin</span> Dashboard
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Manage movies and content
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ title: '', genre: '', duration: '', description: '', posterUrl: '', rating: '', language: 'English' });
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <HiOutlinePlus size={18} />
          Add Movie
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px', marginBottom: '32px',
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <HiOutlineFilm size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total Movies</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
            {movies.length}
          </span>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <HiOutlineTicket size={18} color="#10b981" />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Genres</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
            {new Set(movies.map(m => m.genre)).size}
          </span>
        </div>
      </div>

      {/* Movie List */}
      {loading ? (
        <div style={{ display: 'grid', gap: '12px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '80px', background: 'var(--color-bg-card)', borderRadius: '12px',
              animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%',
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {movies.map((movie) => (
            <div key={movie._id} className="glass-card" style={{
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '16px',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <img src={movie.posterUrl} alt={movie.title} style={{
                width: '48px', height: '68px', borderRadius: '8px', objectFit: 'cover',
              }} onError={(e) => { e.target.style.display = 'none'; }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{movie.title}</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <span>{movie.genre}</span>
                  <span>{movie.duration} min</span>
                  <span>⭐ {movie.rating}</span>
                  <span>{movie.language}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(movie)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
                    color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s',
                  }}
                >
                  <HiOutlinePencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(movie._id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
                    color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s',
                  }}
                >
                  <HiOutlineTrash size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{
            width: '100%', maxWidth: '520px', margin: '16px', padding: '32px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
                <span className="gradient-text">{editing ? 'Edit Movie' : 'Add Movie'}</span>
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--color-text-muted)',
                cursor: 'pointer', borderRadius: '10px', padding: '8px', display: 'flex',
              }}>
                <HiOutlineX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'title', label: 'Title', type: 'text', placeholder: 'Movie Title' },
                { key: 'genre', label: 'Genre', type: 'text', placeholder: 'Action, Drama, Sci-Fi...' },
                { key: 'duration', label: 'Duration (min)', type: 'number', placeholder: '120' },
                { key: 'posterUrl', label: 'Poster URL', type: 'url', placeholder: 'https://...' },
                { key: 'rating', label: 'Rating (0-10)', type: 'number', placeholder: '8.5' },
                { key: 'language', label: 'Language', type: 'text', placeholder: 'English' },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required={['title', 'genre', 'duration', 'posterUrl'].includes(field.key)}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)',
                      color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  placeholder="Movie description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)',
                    color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none',
                    resize: 'vertical', fontFamily: 'var(--font-body)',
                  }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                {editing ? 'Update Movie' : 'Add Movie'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
