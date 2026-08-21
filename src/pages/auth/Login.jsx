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
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            {/* Logo / Brand */}
            <div className="text-center mb-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-lg" style={{ width: '80px', height: '80px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h1 className="text-white fw-bold display-6">MTN Roadshow Admin</h1>
              <p className="text-white-50">Cyber Roadshow Dashboard</p>
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-lg-5">
                {/* YOUR ORIGINAL form - COMPLETELY UNCHANGED */}
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold text-secondary">
                      Email
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <svg width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.729 8.82l-5.695 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                        </svg>
                      </span>
                      {/* YOUR ORIGINAL email input - UNCHANGED */}
                      <input
                        id="email"
                        type="email"
                        className="form-control form-control-lg border-start-0"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-secondary">
                      Password
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <svg width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                      </span>
                      {/* YOUR ORIGINAL password input - UNCHANGED */}
                      <input
                        id="password"
                        type="password"
                        className="form-control form-control-lg border-start-0"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* YOUR ORIGINAL error display - STYLED only */}
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center border-0 rounded-3" role="alert">
                      <svg className="bi flex-shrink-0 me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
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
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-3 text-center">
              <small className="text-white-50">Protected Admin Area</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}