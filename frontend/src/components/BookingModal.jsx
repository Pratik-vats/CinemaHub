import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createBooking } from '../services/bookingService';
import ShowPicker from './ShowPicker';
import SeatSelector from './SeatSelector';
import PaymentFlow from './PaymentFlow';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineTicket, HiOutlineGift } from 'react-icons/hi';

const TICKET_PRICE = 200;

const steps = [
  { id: 1, label: 'Show' },
  { id: 2, label: 'Seats' },
  { id: 3, label: 'Pay' },
];

const BookingModal = ({ movie, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [paying, setPaying] = useState(false);

  const tickets = selectedSeats.length;
  const subtotal = tickets * TICKET_PRICE;
  const discount = usePoints ? Math.floor(pointsToRedeem * 0.5) : 0;
  const total = Math.max(0, subtotal - discount);
  const maxRedeemable = user ? Math.min(user.rewardPoints || 0, Math.floor(subtotal / 0.5)) : 0;

  const handleSeatToggle = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : prev.length < 10
        ? [...prev, seatNumber]
        : prev
    );
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const payload = {
        userId: user._id,
        movieId: movie._id,
        showId: selectedShow._id,
        seats: selectedSeats,
        ...(usePoints && pointsToRedeem >= 100 ? { redeemPoints: pointsToRedeem } : {}),
      };

      const { data } = await createBooking(payload);
      const newPoints = (user.rewardPoints || 0) + data.data.pointsEarned - (pointsToRedeem || 0);
      updateUser({ rewardPoints: newPoints });

      toast.success(`🎉 Booked ${tickets} ticket(s)! Earned ${data.data.pointsEarned} points`, { duration: 4000 });
      onSuccess && onSuccess(data.data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
      setPaying(false);
      setStep(3);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedShow;
    if (step === 2) return selectedSeats.length > 0;
    return true;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: paying ? '480px' : '560px',
          margin: '16px',
          padding: '28px',
          maxHeight: '90vh',
          overflowY: 'auto',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            fontWeight: 700,
          }}>
            <span className="gradient-text">Book Tickets</span>
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
          }}>
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Movie mini info */}
        <div style={{
          display: 'flex', gap: '10px', alignItems: 'center',
          marginBottom: '20px',
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
        }}>
          <img src={movie.posterUrl} alt={movie.title} style={{
            width: '36px', height: '50px', borderRadius: '6px', objectFit: 'cover',
          }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{movie.title}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              {movie.genre} • {movie.duration} min
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        {!paying && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            marginBottom: '24px',
          }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: step >= s.id
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'var(--color-border)',
                    color: step >= s.id ? '#000' : 'var(--color-text-muted)',
                    transition: 'all 0.3s ease',
                  }}>
                    {s.id}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: step === s.id ? 600 : 400,
                    color: step === s.id ? '#f59e0b' : 'var(--color-text-muted)',
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: '32px',
                    height: '2px',
                    background: step > s.id ? '#f59e0b' : 'var(--color-border)',
                    margin: '0 8px',
                    transition: 'background 0.3s ease',
                  }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        {paying ? (
          <PaymentFlow
            amount={total}
            onSuccess={handlePaymentSuccess}
            onFailure={() => { setPaying(false); }}
          />
        ) : (
          <div className="animate-fade-in" key={step}>
            {/* Step 1: Show Selection */}
            {step === 1 && (
              <ShowPicker
                movieId={movie._id}
                onShowSelected={(show) => setSelectedShow(show)}
              />
            )}

            {/* Step 2: Seat Selection */}
            {step === 2 && (
              <SeatSelector
                show={selectedShow}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
              />
            )}

            {/* Step 3: Review & Pay */}
            {step === 3 && (
              <div>
                {/* Summary */}
                <div style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Show</span>
                    <span>{selectedShow?.date} • {selectedShow?.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Screen</span>
                    <span>{selectedShow?.screen}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Seats</span>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>{[...selectedSeats].sort().join(', ')}</span>
                  </div>
                </div>

                {/* Reward points toggle */}
                {user && (user.rewardPoints || 0) >= 100 && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '14px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: usePoints ? '12px' : '0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HiOutlineGift size={18} color="#f59e0b" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          Use Points ({user.rewardPoints} available)
                        </span>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-flex',
                        width: '44px', height: '24px',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={usePoints}
                          onChange={(e) => {
                            setUsePoints(e.target.checked);
                            if (e.target.checked) {
                              setPointsToRedeem(Math.min(maxRedeemable, Math.floor((user.rewardPoints || 0) / 100) * 100));
                            }
                          }}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute', inset: 0,
                          background: usePoints ? '#f59e0b' : 'var(--color-border)',
                          borderRadius: '12px', transition: 'all 0.3s',
                        }} />
                        <span style={{
                          position: 'absolute', top: '2px',
                          left: usePoints ? '22px' : '2px',
                          width: '20px', height: '20px',
                          background: 'white', borderRadius: '50%', transition: 'all 0.3s',
                        }} />
                      </label>
                    </div>
                    {usePoints && (
                      <div>
                        <input
                          type="range"
                          min={100} max={maxRedeemable} step={100}
                          value={pointsToRedeem}
                          onChange={(e) => setPointsToRedeem(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: '#f59e0b' }}
                        />
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px',
                        }}>
                          <span>{pointsToRedeem} points</span>
                          <span>-₹{discount} discount</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Price breakdown */}
                <div style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    <span>Tickets ({tickets} × ₹{TICKET_PRICE})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981', marginBottom: '6px' }}>
                      <span>Reward Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    paddingTop: '10px', marginTop: '10px',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                  }}>
                    <span>Total</span>
                    <span className="gradient-text">₹{total}</span>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)',
                  marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <HiOutlineTicket size={14} color="#f59e0b" />
                  You'll earn <strong style={{ color: '#f59e0b' }}>{tickets * 10} points</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {!paying && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '24px',
            gap: '12px',
          }}>
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <HiOutlineArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  opacity: canProceed() ? 1 : 0.4,
                }}
              >
                Next
                <HiOutlineArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setPaying(true)}
                disabled={tickets === 0}
                className="btn-primary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  opacity: tickets > 0 ? 1 : 0.4,
                }}
              >
                <HiOutlineTicket size={18} />
                Pay ₹{total}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
