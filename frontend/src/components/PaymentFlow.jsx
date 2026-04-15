import { useState, useEffect } from 'react';
import { HiOutlineCheck, HiOutlineRefresh } from 'react-icons/hi';

const PaymentFlow = ({ amount, onSuccess, onFailure }) => {
  const [stage, setStage] = useState('processing'); // processing | success | failed
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Dot animation
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    // Simulate payment processing (1.5-2.5s)
    const delay = 1500 + Math.random() * 1000;
    const timer = setTimeout(() => {
      // 95% success rate
      if (Math.random() < 0.95) {
        setStage('success');
        const paymentId = 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setTimeout(() => onSuccess(paymentId), 1800);
      } else {
        setStage('failed');
      }
    }, delay);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      {stage === 'processing' && (
        <div className="animate-fade-in">
          {/* Spinner */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '3px solid var(--color-border)',
            borderTopColor: '#f59e0b',
            margin: '0 auto 24px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '8px',
          }}>
            Processing Payment{dots}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Please wait while we confirm your payment of <strong style={{ color: '#f59e0b' }}>₹{amount}</strong>
          </p>

          {/* Mock Razorpay branding */}
          <div style={{
            marginTop: '24px',
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#10b981',
              animation: 'pulse-glow 1s infinite',
            }} />
            Secured by Razorpay
          </div>
        </div>
      )}

      {stage === 'success' && (
        <div className="animate-scale-in">
          {/* Success checkmark */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '3px solid #10b981',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'scaleIn 0.4s ease-out',
          }}>
            <HiOutlineCheck size={40} color="#10b981" />
          </div>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#10b981',
            marginBottom: '8px',
          }}>
            Payment Successful! 🎉
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            ₹{amount} has been charged. Generating your tickets...
          </p>

          {/* Confetti dots */}
          <div style={{ position: 'relative', height: '40px', overflow: 'hidden', marginTop: '16px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: ['#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#3b82f6'][i % 5],
                left: `${10 + (i * 7)}%`,
                top: '-10px',
                animation: `confetti-fall 1s ease-out ${i * 0.08}s forwards`,
                opacity: 0,
              }} />
            ))}
          </div>
        </div>
      )}

      {stage === 'failed' && (
        <div className="animate-scale-in">
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '3px solid #ef4444',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '2rem' }}>✕</span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#ef4444',
            marginBottom: '8px',
          }}>
            Payment Failed
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Something went wrong. Your money has not been deducted.
          </p>
          <button
            onClick={() => {
              setStage('processing');
              // Re-trigger useEffect by remounting — just call retry
              setTimeout(() => {
                setStage('success');
                const paymentId = 'PAY_' + Date.now() + '_RETRY';
                setTimeout(() => onSuccess(paymentId), 1800);
              }, 1500);
            }}
            className="btn-primary"
            style={{ padding: '12px 28px' }}
          >
            <HiOutlineRefresh size={18} />
            Retry Payment
          </button>
          <button
            onClick={onFailure}
            className="btn-secondary"
            style={{ marginLeft: '12px', padding: '12px 28px' }}
          >
            Cancel
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(40px) rotate(720deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentFlow;
