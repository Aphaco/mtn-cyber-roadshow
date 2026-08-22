import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ThankYou() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
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
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(40, 167, 69, 0.15) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        animation: 'float1 10s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)',
        bottom: '-150px',
        left: '-150px',
        animation: 'float2 12s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 193, 7, 0.08) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'pulse 6s ease-in-out infinite'
      }}></div>

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
          50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes floatUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <div className="card border-0 shadow-lg rounded-4" style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'floatUp 0.8s ease-out'
            }}>
              <div className="card-body p-4 p-lg-5 text-center">
                {/* Success Animation */}
                <div style={{
                  animation: 'checkmark 0.8s ease-out',
                  display: 'inline-block'
                }}>
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{
                    width: '90px',
                    height: '90px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    boxShadow: '0 10px 40px rgba(40, 167, 69, 0.3)'
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="fw-bold mb-2" style={{
                  color: '#2d3748',
                  fontSize: '32px',
                  letterSpacing: '-0.5px'
                }}>
                  Thank You! 🎉
                </h1>

                <p className="text-muted mb-1" style={{ fontSize: '18px' }}>
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
                  <p style={{ color: '#4a5568', fontSize: '15px', lineHeight: '1.7' }}>
                    We greatly appreciate your time and valuable input.
                    Your feedback helps us improve and deliver better experiences.
                  </p>
                </div>

                {/* Highlights */}
                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="py-2 rounded-3" style={{
                      background: 'rgba(102, 126, 234, 0.06)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '24px' }}>⭐</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Rate Us</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="py-2 rounded-3" style={{
                      background: 'rgba(40, 167, 69, 0.06)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '24px' }}>📝</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Feedback</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="py-2 rounded-3" style={{
                      background: 'rgba(255, 193, 7, 0.06)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '24px' }}>🚀</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Improve</small>
                    </div>
                  </div>
                </div>

                {/* Redirect Countdown */}
                <div className="mb-4">
                  <small className="text-muted" style={{ fontSize: '13px' }}>
                    Redirecting to home in <strong style={{ color: '#667eea' }}>{countdown}</strong> seconds...
                  </small>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="btn btn-primary rounded-3 px-4 py-2 d-flex align-items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    Go to Home
                  </button>
                  <button
                    onClick={() => window.location.href = '/survey/new'}
                    className="btn btn-outline-secondary rounded-3 px-4 py-2"
                    style={{
                      borderColor: '#e2e8f0',
                      color: '#4a5568',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f7fafc'
                      e.currentTarget.style.borderColor = '#cbd5e0'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <small className="text-white-50" style={{ opacity: 0.5, fontSize: '12px' }}>
                MTN Cyber Roadshow • Ghana
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}