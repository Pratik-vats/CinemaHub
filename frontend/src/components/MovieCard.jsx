import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineStar } from 'react-icons/hi';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--color-bg-card)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(245, 158, 11, 0.15)';
        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      >
        {/* Poster */}
        <div style={{
          position: 'relative',
          paddingTop: '140%',
          overflow: 'hidden',
        }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x560/1a1a24/f59e0b?text=${encodeURIComponent(movie.title)}`;
            }}
          />
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, var(--color-bg-card), transparent)',
          }} />
          {/* Rating Badge */}
          {movie.rating > 0 && (
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              borderRadius: '10px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#fbbf24',
            }}>
              <HiOutlineStar size={14} />
              {movie.rating}
            </div>
          )}
          {/* Genre Badge */}
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(245, 158, 11, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#f59e0b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {movie.genre}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--color-text)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {movie.title}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
          }}>
            <HiOutlineClock size={14} />
            <span>{movie.duration} min</span>
            {movie.language && (
              <>
                <span style={{ margin: '0 4px' }}>•</span>
                <span>{movie.language}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
