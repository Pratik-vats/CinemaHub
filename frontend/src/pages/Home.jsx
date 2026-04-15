import { useState, useEffect } from 'react';
import { getAllMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import { HiOutlineSearch, HiOutlineFilm, HiOutlineTicket, HiOutlineStar, HiOutlineFire } from 'react-icons/hi';

const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Animation', 'Thriller', 'Comedy'];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');

  useEffect(() => {
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
    fetchMovies();
  }, []);

  const filtered = movies.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = activeGenre === 'All' || m.genre === activeGenre;
    return matchSearch && matchGenre;
  });

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-200px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#f59e0b',
            marginBottom: '24px',
          }}>
            <HiOutlineFire size={14} />
            Now Showing — Book Your Seats
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Your Ultimate <span className="gradient-text">Cinema</span> Experience
          </h1>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            marginBottom: '36px',
            maxWidth: '550px',
            margin: '0 auto 36px',
          }}>
            Discover, book, and earn rewards. Every ticket gets you closer to free movies with our loyalty program.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '40px',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: <HiOutlineFilm size={20} />, value: movies.length, label: 'Movies' },
              { icon: <HiOutlineTicket size={20} />, value: '₹200', label: 'Per Ticket' },
              { icon: <HiOutlineStar size={20} />, value: '10 pts', label: 'Per Ticket' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: '#f59e0b',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}>
                  {stat.icon}
                  {stat.value}
                </div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{
            position: 'relative',
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            <HiOutlineSearch size={20} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }} />
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 48px',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-card)',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
        </div>
      </section>

      {/* Genre Filter */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 16px',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: activeGenre === genre ? 'none' : '1px solid var(--color-border)',
                background: activeGenre === genre
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'transparent',
                color: activeGenre === genre ? '#000' : 'var(--color-text-muted)',
                fontWeight: activeGenre === genre ? 600 : 400,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Movies Grid */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px 60px',
      }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                background: 'var(--color-bg-card)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}>
                <div style={{
                  paddingTop: '140%',
                  background: 'linear-gradient(90deg, var(--color-bg-card) 25%, var(--color-bg-card-hover) 50%, var(--color-bg-card) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '16px', background: 'var(--color-border)', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ height: '12px', background: 'var(--color-border)', borderRadius: '4px', width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: 'var(--color-text-muted)',
          }}>
            <HiOutlineFilm size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No movies found</p>
            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map((movie, idx) => (
              <div key={movie._id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
