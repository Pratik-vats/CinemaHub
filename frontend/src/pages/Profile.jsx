import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/userService';
import { getUserBookings, cancelBooking } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineTicket, HiOutlineStar, HiOutlineCash, HiOutlineFilm,
  HiOutlineCalendar, HiOutlineArrowUp, HiOutlineArrowDown, HiOutlineTrendingUp,
  HiOutlineX, HiOutlineClock,
} from 'react-icons/hi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Tick every second for countdown timers
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        getUserProfile(user._id),
        getUserBookings(user._id),
      ]);
      setProfile(profileRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [user, navigate, fetchData]);

  const handleCancel = async (bookingId) => {
    try {
      const { data } = await cancelBooking(bookingId);
      toast.success('Booking cancelled! Points adjusted.');
      updateUser({ rewardPoints: data.data.currentPoints });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  const getCancelInfo = (booking) => {
    if (booking.status === 'Cancelled') return { canCancel: false, label: 'Cancelled' };
    const createdAt = new Date(booking.createdAt).getTime();
    const deadline = createdAt + 10 * 60 * 1000; // 10 minutes
    const remaining = deadline - now;
    if (remaining <= 0) return { canCancel: false, label: 'Cancel expired' };
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return {
      canCancel: true,
      label: `Cancel (${mins}:${secs.toString().padStart(2, '0')})`,
      remaining,
    };
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              height: '120px', background: 'var(--color-bg-card)',
              borderRadius: '16px', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%',
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) return null;
  const { user: userData, stats, rewardHistory } = profile;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }} className="animate-fade-in">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '8px' }}>
          My <span className="gradient-text">Profile</span>
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Welcome back, {userData.name}!</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '36px',
      }} className="animate-slide-up">
        {/* Reward Points */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))',
          border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '28px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)', borderRadius: '50%',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HiOutlineStar size={20} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Reward Points</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }}>
            <span className="gradient-text">{userData.rewardPoints}</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Worth ₹{Math.floor(userData.rewardPoints * 0.5)} in discounts
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HiOutlineTicket size={20} color="#10b981" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Bookings</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: '#10b981' }}>
            {stats.bookingCount}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HiOutlineCash size={20} color="#8b5cf6" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Spent</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: '#8b5cf6' }}>₹{stats.totalSpent}</div>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HiOutlineTrendingUp size={20} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Earned</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b' }}>
            {stats.totalPointsEarned}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>points earned all time</p>
        </div>
      </div>

      {/* Two Column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="profile-grid">
        {/* Reward History */}
        <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineStar size={20} color="#f59e0b" /> Reward History
          </h2>
          {rewardHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-muted)' }}>
              <HiOutlineStar size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>No reward transactions yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {rewardHistory.map((r) => (
                <div key={r._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: r.type === 'EARN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: r.type === 'EARN' ? '#10b981' : '#ef4444',
                    }}>
                      {r.type === 'EARN' ? <HiOutlineArrowUp size={18} /> : <HiOutlineArrowDown size={18} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{r.description}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '0.95rem',
                    color: r.type === 'EARN' ? '#10b981' : '#ef4444',
                  }}>
                    {r.type === 'EARN' ? '+' : '-'}{r.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking History */}
        <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineFilm size={20} color="#8b5cf6" /> Booking History
          </h2>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-muted)' }}>
              <HiOutlineFilm size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>No bookings yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {bookings.map((b) => {
                const cancelInfo = getCancelInfo(b);
                return (
                  <div key={b._id} style={{
                    padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                    border: `1px solid ${b.status === 'Cancelled' ? 'rgba(239,68,68,0.2)' : 'var(--color-border)'}`,
                    opacity: b.status === 'Cancelled' ? 0.6 : 1,
                  }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {b.movieId && (
                        <img src={b.movieId.posterUrl} alt={b.movieId.title} style={{
                          width: '48px', height: '64px', borderRadius: '8px', objectFit: 'cover',
                        }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                            {b.movieId?.title ?? 'Movie'}
                          </p>
                          {/* Status badge */}
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                            background: b.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: b.status === 'Active' ? '#10b981' : '#ef4444',
                            border: `1px solid ${b.status === 'Active' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          }}>
                            {b.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HiOutlineTicket size={12} /> {b.tickets} ticket(s)
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HiOutlineCash size={12} /> ₹{b.totalAmount}
                          </span>
                          {b.showId && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <HiOutlineClock size={12} /> {b.showId.time}
                            </span>
                          )}
                        </div>
                        {b.seats && b.seats.length > 0 && (
                          <p style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '4px', fontWeight: 500 }}>
                            Seats: {b.seats.join(', ')}
                          </p>
                        )}
                        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          <HiOutlineCalendar size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Cancel button */}
                    {b.status === 'Active' && (
                      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                        {cancelInfo.canCancel ? (
                          <button
                            onClick={() => handleCancel(b._id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.08)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              borderRadius: '8px',
                              padding: '6px 14px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s',
                            }}
                          >
                            <HiOutlineX size={12} />
                            {cancelInfo.label}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            Cancel window expired
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="glass-card animate-fade-in" style={{
        marginTop: '24px', padding: '24px 28px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{userData.name}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{userData.email}</p>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Member since {new Date(userData.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
