import { useState, useEffect } from 'react';
import { getShows } from '../services/showService';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';

const ShowPicker = ({ movieId, onShowSelected }) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate next 7 days
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      // Use local date components to avoid UTC timezone mismatch
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      days.push({
        dateStr,
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: d.getDate(),
        month: d.toLocaleDateString('en-IN', { month: 'short' }),
        isToday: i === 0,
      });
    }
    setDates(days);
    setSelectedDate(days[0].dateStr);
  }, []);

  // Fetch shows when date changes
  const fetchShows = async () => {
    if (!selectedDate || !movieId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await getShows(movieId, selectedDate);
      setShows(data.data);
      setSelectedShow(null);
    } catch (err) {
      console.error(err);
      setShows([]);
      setError('Failed to load showtimes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [selectedDate, movieId]);

  const handleSelectShow = (show) => {
    setSelectedShow(show);
    onShowSelected(show);
  };

  return (
    <div>
      {/* Date Scroller */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)',
          marginBottom: '12px',
        }}>
          <HiOutlineCalendar size={16} />
          Select Date
        </label>
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {dates.map((d) => (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              style={{
                minWidth: '72px',
                padding: '12px 8px',
                borderRadius: '14px',
                border: selectedDate === d.dateStr ? 'none' : '1px solid var(--color-border)',
                background: selectedDate === d.dateStr
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(255,255,255,0.02)',
                color: selectedDate === d.dateStr ? '#000' : 'var(--color-text)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transform: selectedDate === d.dateStr ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span style={{
                fontSize: '0.7rem', fontWeight: 500,
                opacity: selectedDate === d.dateStr ? 1 : 0.6,
              }}>
                {d.isToday ? 'Today' : d.day}
              </span>
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
              }}>
                {d.date}
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 500,
                opacity: 0.7,
              }}>
                {d.month}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)',
          marginBottom: '12px',
        }}>
          <HiOutlineClock size={16} />
          Select Showtime
        </label>

        {loading ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                width: '110px', height: '60px',
                borderRadius: '12px', background: 'var(--color-bg-card)',
                animation: 'shimmer 1.5s infinite',
                backgroundSize: '200% 100%',
              }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: '16px 0', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '8px' }}>
              {error}
            </p>
            <button
              onClick={() => fetchShows()}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: '0.8rem',
                color: '#ef4444',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        ) : shows.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', padding: '16px 0' }}>
            No shows available for this date
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {shows.map((show) => {
              const isSelected = selectedShow?._id === show._id;
              const bookedCount = show.seats.filter((s) => s.isBooked).length;
              const totalSeats = show.seats.length;
              const availablePercent = ((totalSeats - bookedCount) / totalSeats) * 100;
              let statusColor = '#10b981'; // green
              if (availablePercent < 30) statusColor = '#ef4444'; // red
              else if (availablePercent < 60) statusColor = '#f59e0b'; // amber

              return (
                <button
                  key={show._id}
                  onClick={() => handleSelectShow(show)}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '14px',
                    border: isSelected
                      ? '2px solid #f59e0b'
                      : '1px solid var(--color-border)',
                    background: isSelected
                      ? 'rgba(245, 158, 11, 0.08)'
                      : 'rgba(255,255,255,0.02)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    minWidth: '110px',
                  }}
                >
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    color: isSelected ? '#f59e0b' : 'var(--color-text)',
                  }}>
                    {show.time}
                  </span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 500,
                    color: 'var(--color-text-muted)',
                  }}>
                    {show.screen}
                  </span>
                  <div style={{
                    width: '100%', height: '3px',
                    borderRadius: '2px',
                    background: 'var(--color-border)',
                    overflow: 'hidden',
                    marginTop: '2px',
                  }}>
                    <div style={{
                      width: `${availablePercent}%`,
                      height: '100%',
                      background: statusColor,
                      borderRadius: '2px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '0.6rem',
                    color: statusColor,
                    fontWeight: 500,
                  }}>
                    {totalSeats - bookedCount} seats left
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPicker;
