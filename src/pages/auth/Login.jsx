import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function Login() {
  const navigate = useNavigate()

  // YOUR ORIGINAL STATE - COMPLETELY UNCHANGED
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // YOUR ORIGINAL handleLogin - COMPLETELY UNCHANGED
  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Orbs */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            {/* Logo / Brand */}
            <div className="text-center mb-4">
              <div className="bg-white rounded-4 d-inline-flex align-items-center justify-content-center mb-3 shadow-lg" style={{ 
                width: '72px', 
                height: '72px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h1 className="fw-bold text-white mb-1" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>
                MTN Roadshow Admin
              </h1>
              <p className="text-white-50" style={{ fontSize: '14px' }}>Cyber Roadshow Dashboard</p>
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-lg rounded-4" style={{
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div className="card-body p-4 p-lg-5">
                {/* Welcome Text */}
                <div className="text-center mb-4">
                  <h5 className="fw-bold mb-1" style={{ color: '#2d3748' }}>Welcome Back</h5>
                  <p className="text-muted small mb-0">Sign in to your admin account</p>
                </div>

                {/* YOUR ORIGINAL form - COMPLETELY UNCHANGED */}
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '13px' }}>
                      Email Address
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                        <svg width="18" height="18" fill="#a0aec0" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.729 8.82l-5.695 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                        </svg>
                      </span>
                      {/* YOUR ORIGINAL email input - UNCHANGED */}
                      <input
                        id="email"
                        type="email"
                        className="form-control form-control-lg border-start-0"
                        style={{ borderRadius: '0 12px 12px 0' }}
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '13px' }}>
                      Password
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                        <svg width="18" height="18" fill="#a0aec0" viewBox="0 0 16 16">
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                      </span>
                      {/* YOUR ORIGINAL password input - UNCHANGED */}
                      <input
                        id="password"
                        type="password"
                        className="form-control form-control-lg border-start-0"
                        style={{ borderRadius: '0 12px 12px 0' }}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* YOUR ORIGINAL error display - STYLED only */}
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center border-0 rounded-3" role="alert" style={{ 
                      background: '#fff5f5',
                      color: '#e53e3e',
                      fontSize: '14px'
                    }}>
                      <svg className="bi flex-shrink-0 me-2" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 4h2v5H7V4zm0 7h2v2H7v-2z"/>
                      </svg>
                      <div>{error}</div>
                    </div>
                  )}

                  {/* YOUR ORIGINAL button - STYLED only */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-semibold"
                    disabled={loading}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      fontSize: '16px',
                      letterSpacing: '0.5px'
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
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Demo Credentials Hint */}
                  <div className="mt-4 text-center">
                    <small className="text-muted" style={{ fontSize: '12px' }}>
                      <span className="fw-semibold">Demo:</span> admin@example.com • password
                    </small>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-4 text-center">
              <small className="text-white-50" style={{ opacity: 0.6, fontSize: '12px' }}>
                Protected Admin Area • v1.0.0
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}