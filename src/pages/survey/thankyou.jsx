import { useEffect, useState } from 'react'

export default function ThankYou() {
  const [countdown, setCountdown] = useState(8)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Start confetti after 1 second
    setTimeout(() => setShowConfetti(true), 500)

    // Countdown to redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Redirect to a safe public page (not admin!)
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Confetti Particles */}
      {showConfetti && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[...Array(50)].map((_, i) => {
            const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bcb', '#a66bff']
            const size = Math.random() * 8 + 4
            const left = Math.random() * 100
            const delay = Math.random() * 3
            const duration = Math.random() * 2 + 2
            const rotation = Math.random() * 720 - 360
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size * 1.5}px`,
                  background: colors[Math.floor(Math.random() * colors.length)],
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
                  transform: `rotate(${rotation}deg)`,
                  opacity: 0
                }}
              />
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 25px) scale(1.15); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.15) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes floatUp {
          0% { transform: translateY(40px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(40, 167, 69, 0.3); }
          50% { box-shadow: 0 0 60px rgba(40, 167, 69, 0.6); }
        }
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Animated Background Orbs */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(40, 167, 69, 0.12) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        animation: 'float1 10s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.10) 0%, transparent 70%)',
        bottom: '-150px',
        left: '-150px',
        animation: 'float2 12s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 193, 7, 0.06) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'pulse 6s ease-in-out infinite'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <div className="card border-0 shadow-lg rounded-4" style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              animation: 'floatUp 0.8s ease-out'
            }}>
              <div className="card-body p-4 p-lg-5 text-center">
                {/* Success Animation */}
                <div style={{
                  animation: 'checkmark 0.8s ease-out',
                  display: 'inline-block'
                }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    boxShadow: '0 10px 40px rgba(40, 167, 69, 0.3)',
                    animation: 'glowPulse 3s ease-in-out infinite'
                  }}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="fw-bold mb-2" style={{
                  color: '#2d3748',
                  fontSize: '34px',
                  letterSpacing: '-0.5px'
                }}>
                  Thank You! 🎉
                </h1>

                <p className="text-muted mb-1" style={{ fontSize: '18px', fontWeight: '500' }}>
                  Your feedback has been successfully submitted.
                </p>

                {/* Divider */}
                <div className="my-4" style={{
                  width: '80px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '10px',
                  margin: '0 auto'
                }}></div>

                {/* Success Message */}
                <div className="mb-4">
                  <p style={{ color: '#4a5568', fontSize: '15px', lineHeight: '1.8' }}>
                    We greatly appreciate your time and valuable input.
                    Your feedback helps us improve and deliver better experiences.
                  </p>
                </div>

                {/* Highlights */}
                <div className="row g-2 mb-4">
                  <div className="col-4">
                    <div className="py-2 rounded-3" style={{
                      background: 'rgba(102, 126, 234, 0.06)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '26px' }}>⭐</div>
                      <small className="text-muted" style={{ fontSize: '10px', fontWeight: '500' }}>Rate Us</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="py-2 rounded-3" style={{
                      background: 'rgba(40, 167, 69, 0.06)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '26px' }}>📝</div>
                      <small className="text-muted" style={{ fontSize: '10px', fontWeight: '500' }}>Feedback</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="py-2 rounded-3" style={{
                      background: 'rgba(255, 193, 7, 0.06)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '26px' }}>🚀</div>
                      <small className="text-muted" style={{ fontSize: '10px', fontWeight: '500' }}>Improve</small>
                    </div>
                  </div>
                </div>

                {/* Auto-redirect Countdown - No buttons! */}
                <div className="mt-3">
                  <small className="text-muted" style={{ fontSize: '13px' }}>
                    <span style={{ opacity: 0.6 }}>You will be redirected in </span>
                    <strong style={{ 
                      color: '#667eea', 
                      fontSize: '18px',
                      display: 'inline-block',
                      minWidth: '24px'
                    }}>
                      {countdown}
                    </strong>
                    <span style={{ opacity: 0.6 }}> seconds...</span>
                  </small>
                  <div className="mt-2" style={{
                    width: '120px',
                    height: '3px',
                    background: '#e2e8f0',
                    borderRadius: '10px',
                    margin: '0 auto',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(countdown / 8) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      borderRadius: '10px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>

                {/* Subtle note - no navigation links! */}
                <div className="mt-4">
                  <small style={{ color: 'rgba(0,0,0,0.2)', fontSize: '11px' }}>
                    ✦ You're all set ✦
                  </small>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <small className="text-white-50" style={{ opacity: 0.4, fontSize: '12px' }}>
                MTN Cyber Roadshow • Ghana
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}