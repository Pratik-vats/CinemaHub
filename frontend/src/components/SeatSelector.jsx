import { HiOutlineX } from 'react-icons/hi';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = 8;

const SeatSelector = ({ show, selectedSeats, onSeatToggle }) => {
  if (!show) return null;

  const seatMap = {};
  show.seats.forEach((s) => {
    seatMap[s.seatNumber] = s.isBooked;
  });

  return (
    <div>
      {/* Screen */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        position: 'relative',
      }}>
        <div style={{
          width: '70%',
          height: '6px',
          margin: '0 auto 8px',
          background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(245,158,11,0.3)',
        }} />
        <span style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          fontWeight: 600,
        }}>
          Screen
        </span>
      </div>

      {/* Seat Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}>
        {ROWS.map((row) => (
          <div key={row} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {/* Row label */}
            <span style={{
              width: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textAlign: 'center',
            }}>
              {row}
            </span>

            {/* Seats */}
            {Array.from({ length: COLS }, (_, i) => {
              const seatNumber = `${row}${i + 1}`;
              const isBooked = seatMap[seatNumber] || false;
              const isSelected = selectedSeats.includes(seatNumber);

              // Add aisle gap after column 4
              const marginRight = i === 3 ? '16px' : '0';

              return (
                <button
                  key={seatNumber}
                  disabled={isBooked}
                  onClick={() => onSeatToggle(seatNumber)}
                  title={isBooked ? `${seatNumber} - Booked` : `${seatNumber} - ${isSelected ? 'Selected' : 'Available'}`}
                  style={{
                    width: '36px',
                    height: '34px',
                    borderRadius: '8px 8px 4px 4px',
                    border: 'none',
                    cursor: isBooked ? 'not-allowed' : 'pointer',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    marginRight,
                    position: 'relative',
                    ...(isBooked
                      ? {
                          background: 'rgba(255,255,255,0.04)',
                          color: 'rgba(255,255,255,0.15)',
                        }
                      : isSelected
                      ? {
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#000',
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.08)',
                          color: 'var(--color-text-muted)',
                        }),
                  }}
                  onMouseEnter={(e) => {
                    if (!isBooked && !isSelected) {
                      e.currentTarget.style.background = 'rgba(245,158,11,0.2)';
                      e.currentTarget.style.color = '#f59e0b';
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isBooked && !isSelected) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {isBooked ? <HiOutlineX size={12} /> : (i + 1)}
                </button>
              );
            })}

            {/* Row label right */}
            <span style={{
              width: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textAlign: 'center',
            }}>
              {row}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid var(--color-border)',
      }}>
        {[
          { color: 'rgba(255,255,255,0.08)', border: 'none', label: 'Available' },
          { color: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', label: 'Selected' },
          { color: 'rgba(255,255,255,0.04)', border: 'none', label: 'Booked' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '20px',
              height: '18px',
              borderRadius: '5px 5px 2px 2px',
              background: item.color,
            }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Selected: {' '}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b' }}>
              {[...selectedSeats].sort().join(', ')}
            </span>
          </div>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}>
            {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;
