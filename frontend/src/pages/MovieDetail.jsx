import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie } from '../services/movieService';
import { useAuth } from '../hooks/useAuth';
import BookingModal from '../components/BookingModal';
import { HiOutlineClock, HiOutlineStar, HiOutlineTicket, HiOutlineArrowLeft, HiOutlineGlobe } from 'react-icons/hi';
import toast from 'react-hot-toast';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await getMovie(id);
        setMovie(data.data);
      } catch {
        toast.error('Movie not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '40px',
        }}>
          <div style={{
            height: '480px',
            background: 'var(--color-bg-card)',
            borderRadius: '20px',
            animation: 'shimmer 1.5s infinite',
            backgroundSize: '200% 100%',
          }} />
          <div>
            <div style={{ height: 32, width: '60%', background: 'var(--color-bg-card)', borderRadius: 8, marginBottom: 16 }} />
            <div style={{ height: 20, width: '40%', background: 'var(--color-bg-card)', borderRadius: 8, marginBottom: 24 }} />
            <div style={{ height: 100, background: 'var(--color-bg-card)', borderRadius: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div>
      {/* Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: `linear-gradient(to bottom, rgba(15,15,20,0.5), var(--color-bg-dark) 60%), url(${movie.posterUrl}) center/cover`,
        filter: 'blur(60px)',
        opacity: 0.3,
      }} />

      <div style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '32px',
            padding: '8px 0',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
        >
          <HiOutlineArrowLeft size={18} />
          Back
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '48px',
          alignItems: 'start',
        }} className="movie-detail-grid">
          {/* Poster */}
          <div className="animate-fade-in" style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{
                width: '100%',
                display: 'block',
                borderRadius: '20px',
              }}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x560/1a1a24/f59e0b?text=${encodeURIComponent(movie.title)}`;
              }}
            />
          </div>

          {/* Details */}
          <div className="animate-slide-up">
            {/* Genre badge */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#f59e0b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px',
            }}>
              {movie.genre}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              {movie.title}
            </h1>

            {/* Meta */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}>
              {movie.rating > 0 && (
                <div style={metaStyle}>
                  <HiOutlineStar size={18} color="#fbbf24" />
                  <span style={{ fontWeight: 600, color: '#fbbf24' }}>{movie.rating}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>/10</span>
                </div>
              )}
              <div style={metaStyle}>
                <HiOutlineClock size={18} />
                <span>{movie.duration} min</span>
              </div>
              <div style={metaStyle}>
                <HiOutlineGlobe size={18} />
                <span>{movie.language}</span>
              </div>
            </div>

            {/* Description */}
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '36px',
            }}>
              {movie.description}
            </p>

            {/* Price info */}
            <div className="glass-card" style={{
              padding: '20px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Ticket Price
                </p>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                }}>
                  <span className="gradient-text">₹200</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 400 }}> /ticket</span>
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                color: '#10b981',
                fontWeight: 500,
              }}>
                <HiOutlineTicket size={16} />
                Earn 10 points per ticket
              </div>
            </div>

            {/* Book button */}
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please login to book tickets');
                  navigate('/login');
                  return;
                }
                setShowBooking(true);
              }}
              className="btn-primary animate-pulse-glow"
              style={{
                fontSize: '1.05rem',
                padding: '16px 40px',
              }}
            >
              <HiOutlineTicket size={22} />
              Book Tickets Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal
          movie={movie}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {}}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .movie-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

const metaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.9rem',
  color: 'var(--color-text)',
};

export default MovieDetail;
