import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HiOutlineTicket, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineShieldCheck } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(15, 15, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}>
            🎬
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 700,
          }}>
            <span className="gradient-text">Cinema</span>Hub
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }} className="desktop-nav">
          <Link to="/" style={navLinkStyle}>Home</Link>
          <Link to="/movies" style={navLinkStyle}>Movies</Link>
          {user ? (
            <>
              <Link to="/profile" style={navLinkStyle}>
                <HiOutlineUser size={18} />
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ ...navLinkStyle, color: '#f59e0b' }}>
                  <HiOutlineShieldCheck size={18} />
                  Admin
                </Link>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginLeft: '8px',
                paddingLeft: '16px',
                borderLeft: '1px solid var(--color-border)',
              }}>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <HiOutlineTicket size={16} />
                  {user.rewardPoints ?? 0} pts
                </div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  {user.name}
                </span>
                <button onClick={handleLogout} style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }} title="Logout">
                  <HiOutlineLogout size={20} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text)',
          cursor: 'pointer',
          fontSize: '1.5rem',
        }} className="mobile-menu-btn">
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-dark)',
        }} className="mobile-nav">
          <Link to="/" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Home</Link>
          <Link to="/movies" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Movies</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ ...mobileLinkStyle, color: '#f59e0b' }}>Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} style={{ ...mobileLinkStyle, background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={mobileLinkStyle}>Register</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

const navLinkStyle = {
  color: 'var(--color-text-muted)',
  fontSize: '0.9rem',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '10px',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const mobileLinkStyle = {
  color: 'var(--color-text)',
  fontSize: '1rem',
  padding: '12px 0',
  borderBottom: '1px solid var(--color-border)',
  fontWeight: 500,
};

export default Navbar;
