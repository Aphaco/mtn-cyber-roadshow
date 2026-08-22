import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [guestCount, setGuestCount] = useState(0)
  const [smsSentCount, setSmsSentCount] = useState(0)
  const [surveyedCount, setSurveyedCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [recentGuests, setRecentGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fetch stats - UNCHANGED
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📊 Fetching dashboard stats...')

        const { count: totalGuests } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
        setGuestCount(totalGuests || 0)

        const { count: sent } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .eq('sms_status', 'sent')
        setSmsSentCount(sent || 0)

        const { count: surveyed } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
        setSurveyedCount(surveyed || 0)

        const { count: pending } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .eq('survey_completed', false)
        setPendingCount(pending || 0)

        const { data: recent } = await supabase
          .from('guests')
          .select(`
            id,
            phone,
            location_id,
            created_at,
            sms_status,
            survey_completed,
            locations (name)
          `)
          .order('created_at', { ascending: false })
          .limit(10)

        setRecentGuests(recent || [])

      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // YOUR ORIGINAL handleLogout - UNCHANGED
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', active: true },
    { path: '/admin/register', label: 'Register Guest', icon: '👤' },
    { path: '/admin/export', label: 'Export Data', icon: '📥' },
  ]

  return (
    <div className="d-flex min-vh-100" style={{ background: '#f0f4f8' }}>
      {/* ========== SIDEBAR ========== */}
      <aside 
        className="sidebar"
        style={{ 
          width: '260px', 
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 1050, 
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          boxShadow: '2px 0 20px rgba(0,0,0,0.3)',
          transform: window.innerWidth < 768 ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Brand */}
        <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
              <span className="fw-bold text-white" style={{ fontSize: '18px' }}>MTN</span>
            </div>
            <div>
              <h5 className="fw-bold text-white mb-0" style={{ fontSize: '16px' }}>CYBER ROADSHOW</h5>
              <small style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Panel</small>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow-1 p-3">
          <p className="text-uppercase small fw-bold px-3 mb-3" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
            Main Menu
          </p>
          <ul className="nav flex-column gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`nav-link rounded-3 d-flex align-items-center gap-3 px-3 py-2 w-100 border-0 ${
                    window.location.pathname === item.path 
                      ? 'bg-primary text-white' 
                      : 'text-white-50'
                  }`}
                  style={{ 
                    transition: 'all 0.2s',
                    background: window.location.pathname === item.path ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.active && (
                    <span className="ms-auto">
                      <span className="badge bg-primary rounded-pill" style={{ fontSize: '8px' }}>●</span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            className="btn w-100 rounded-3 d-flex align-items-center gap-3 px-3 py-2 border-0"
            style={{ 
              color: '#ff6b6b',
              transition: 'all 0.2s',
              background: 'rgba(255, 107, 107, 0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            <span>Logout</span>
          </button>
          <p className="text-center mb-0 mt-2" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
            v1.0.0
          </p>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100" style={{ marginLeft: window.innerWidth >= 768 ? '260px' : '0' }}>
        {/* ====== Top Header ====== */}
        <header className="bg-white shadow-sm px-4 py-3 d-flex align-items-center justify-content-between" style={{ zIndex: 1040 }}>
          <div className="d-flex align-items-center gap-3">
            {/* ✅ Hamburger button - ALWAYS visible on mobile */}
            <button
              className="btn d-md-none p-2 rounded-3 border-0"
              style={{ background: '#f0f4f8' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <div>
              <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
                <span className="me-2">👋</span> Welcome back, Admin
              </h5>
              <small className="text-muted">Here's what's happening with your roadshow</small>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }}>
              <span className="d-inline-block rounded-circle" style={{ width: '8px', height: '8px', background: '#28a745' }}></span>
              Live
            </span>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <span className="text-white fw-bold small">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* ====== Page Content ====== */}
        <main className="flex-grow-1 p-4">
          {/* Page Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1" style={{ color: '#2d3748' }}>
                📊 Dashboard
              </h4>
              <p className="text-muted small mb-0">Overview of your roadshow registrations and survey responses</p>
            </div>
            <div className="d-flex gap-2 mt-2 mt-sm-0">
              <button 
                onClick={() => navigate('/admin/register')}
                className="btn btn-primary rounded-3 px-4 d-flex align-items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
              >
                <span>👤</span> New Guest
              </button>
              <button 
                onClick={() => navigate('/admin/export')}
                className="btn btn-outline-secondary rounded-3 px-4 d-flex align-items-center gap-2"
              >
                <span>📥</span> Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                      <span style={{ fontSize: '24px' }}>👥</span>
                    </div>
                    <div>
                      <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Total Guests</h6>
                      <h3 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{loading ? '...' : guestCount}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                      <span style={{ fontSize: '24px' }}>✉️</span>
                    </div>
                    <div>
                      <h6 className="text-muted mb-0 small text-uppercase fw-semibold">SMS Sent</h6>
                      <h3 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{loading ? '...' : smsSentCount}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(23, 162, 184, 0.1)' }}>
                      <span style={{ fontSize: '24px' }}>✅</span>
                    </div>
                    <div>
                      <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Surveyed</h6>
                      <h3 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{loading ? '...' : surveyedCount}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                      <span style={{ fontSize: '24px' }}>⏳</span>
                    </div>
                    <div>
                      <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Pending</h6>
                      <h3 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{loading ? '...' : pendingCount}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: '#2d3748' }}>
                      <span className="me-2">👤</span> Register New Guest
                    </h5>
                    <p className="text-muted small mb-0">Add a guest and send survey link via SMS</p>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/register')}
                    className="btn btn-primary rounded-3 px-4"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: '#2d3748' }}>
                      <span className="me-2">📥</span> Export Responses
                    </h5>
                    <p className="text-muted small mb-0">Download all survey responses as Excel or CSV</p>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/export')}
                    className="btn btn-success rounded-3 px-4"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Guests Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 px-4 pt-4 pb-0 d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
                <span className="me-2">📋</span> Recent Registrations
              </h5>
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                {recentGuests.length} guests
              </span>
            </div>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3">Loading registrations...</p>
                </div>
              ) : recentGuests.length === 0 ? (
                <div className="text-center py-5">
                  <div className="display-1 text-muted opacity-25 mb-3">📋</div>
                  <p className="text-muted mb-0 fw-medium">No guests registered yet</p>
                  <p className="text-muted small">Register a guest to see them here</p>
                  <button 
                    onClick={() => navigate('/admin/register')}
                    className="btn btn-primary rounded-3 px-4 mt-3"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    👤 Register Your First Guest
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8f9fa' }}>
                      <tr>
                        <th className="fw-semibold text-muted small text-uppercase">Phone</th>
                        <th className="fw-semibold text-muted small text-uppercase">Location</th>
                        <th className="fw-semibold text-muted small text-uppercase">Registered</th>
                        <th className="fw-semibold text-muted small text-uppercase">SMS</th>
                        <th className="fw-semibold text-muted small text-uppercase text-center">Survey</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentGuests.map((guest, index) => (
                        <tr key={guest.id || index} style={{ transition: 'background 0.2s' }}>
                          <td className="fw-medium">
                            <span className="d-flex align-items-center gap-2">
                              <span className="text-muted">📱</span>
                              {guest.phone}
                            </span>
                          </td>
                          <td>
                            <span className="d-flex align-items-center gap-1">
                              <span className="text-muted">📍</span>
                              {guest.locations?.name || 'N/A'}
                            </span>
                          </td>
                          <td className="text-muted small">
                            <span className="d-flex align-items-center gap-1">
                              <span>📅</span>
                              {guest.created_at ? new Date(guest.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td>
                            {guest.sms_status === 'sent' ? (
                              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1">
                                <span className="d-inline-block rounded-circle bg-success" style={{ width: '6px', height: '6px' }}></span>
                                Sent
                              </span>
                            ) : (
                              <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1">
                                <span className="d-inline-block rounded-circle bg-warning" style={{ width: '6px', height: '6px' }}></span>
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            {guest.survey_completed ? (
                              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                ✅ Done
                              </span>
                            ) : (
                              <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">
                                ⏳ Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ====== Footer ====== */}
        <footer className="bg-white border-top py-3 px-4 text-center">
          <small className="text-muted">
            &copy; 2026 MEGA DESIGNS • All rights reserved • v1.0.0
          </small>
        </footer>
      </div>

      {/* ====== MOBILE OVERLAY - CLOSES SIDEBAR WHEN CLICKED ====== */}
      {sidebarOpen && (
        <div 
          className="d-md-none position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}