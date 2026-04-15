import { HiOutlineHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--color-bg-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '40px 24px',
      marginTop: '60px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}>
            🎬
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            fontWeight: 700,
          }}>
            <span className="gradient-text">Cinema</span>Hub Lite
          </span>
        </div>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          Made by Vatman
        </p>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.75rem',
          opacity: 0.6,
        }}>
          © {new Date().getFullYear()} CinemaHub Lite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
