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

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📊 Fetching dashboard stats...')

        // Get total guests
        const { count: totalGuests, error: totalError } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
        
        if (totalError) console.error('Total guests error:', totalError)
        setGuestCount(totalGuests || 0)
        console.log('Total guests:', totalGuests)

        // Get SMS sent count
        const { count: sent, error: sentError } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .eq('sms_status', 'sent')
        
        if (sentError) console.error('SMS sent error:', sentError)
        setSmsSentCount(sent || 0)
        console.log('SMS sent:', sent)

        // Get survey completed count from feedback table
        const { count: surveyed, error: surveyedError } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
        
        if (surveyedError) console.error('Surveyed error:', surveyedError)
        setSurveyedCount(surveyed || 0)
        console.log('Surveyed:', surveyed)

        // Get pending count
        const { count: pending, error: pendingError } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .eq('survey_completed', false)
        
        if (pendingError) console.error('Pending error:', pendingError)
        setPendingCount(pending || 0)
        console.log('Pending:', pending)

        // ✅ FIXED: Get recent guests with proper error handling
        console.log('🔍 Fetching recent guests...')
        const { data: recent, error: recentError } = await supabase
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

        if (recentError) {
          console.error('❌ Recent guests error:', recentError)
        } else {
          console.log('✅ Recent guests found:', recent?.length || 0)
          setRecentGuests(recent || [])
        }

      } catch (error) {
        console.error('❌ Error fetching stats:', error)
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

  return (
    <div className="min-vh-100" style={{ background: '#f0f2f5' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <span className="navbar-brand fw-bold">
            <svg className="me-2" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
            MTN Cyber Roadshow
          </span>
          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="text-white-50 small">Admin</span>
            <button 
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                    <svg width="24" height="24" fill="#667eea" viewBox="0 0 16 16">
                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    </svg>
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Total Guests</h6>
                    <h3 className="fw-bold mb-0">{loading ? '...' : guestCount}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                    <svg width="24" height="24" fill="#28a745" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">SMS Sent</h6>
                    <h3 className="fw-bold mb-0">{loading ? '...' : smsSentCount}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
                    <svg width="24" height="24" fill="#17a2b8" viewBox="0 0 16 16">
                      <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5v3A1.5 1.5 0 0 0 6.5 7h3A1.5 1.5 0 0 0 11 5.5v-3A1.5 1.5 0 0 0 9.5 1h-3zm0 8A1.5 1.5 0 0 0 5 10.5v3A1.5 1.5 0 0 0 6.5 15h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 9.5 9h-3z"/>
                    </svg>
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Surveyed</h6>
                    <h3 className="fw-bold mb-0">{loading ? '...' : surveyedCount}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                    <svg width="24" height="24" fill="#ffc107" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Pending</h6>
                    <h3 className="fw-bold mb-0">{loading ? '...' : pendingCount}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="fw-bold mb-1">Register New Guest</h5>
                  <p className="text-muted small mb-0">Add a guest and send survey link via SMS</p>
                </div>
                <button 
                  onClick={() => navigate('/admin/register')}
                  className="btn btn-primary rounded-3 px-4"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                >
                  <svg className="me-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                  Register Guest
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="fw-bold mb-1">Export Responses</h5>
                  <p className="text-muted small mb-0">Download all survey responses as Excel or CSV</p>
                </div>
                <button 
                  onClick={() => navigate('/admin/export')}
                  className="btn btn-success rounded-3 px-4"
                >
                  <svg className="me-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Guests Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 pt-3">
            <h5 className="fw-bold mb-0">Recent Registrations</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : recentGuests.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted mb-0">No guests registered yet</p>
                <p className="text-muted small">Register a guest to see them here</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Registered</th>
                      <th>SMS</th>
                      <th>Survey</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentGuests.map((guest, index) => (
                      <tr key={guest.id || index}>
                        <td className="fw-medium">{guest.phone}</td>
                        <td>{guest.locations?.name || 'N/A'}</td>
                        <td className="text-muted small">
                          {guest.created_at ? new Date(guest.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          {guest.sms_status === 'sent' ? (
                            <span className="badge bg-success bg-opacity-10 text-success">Sent</span>
                          ) : (
                            <span className="badge bg-warning bg-opacity-10 text-warning">Pending</span>
                          )}
                        </td>
                        <td>
                          {guest.survey_completed ? (
                            <span className="badge bg-success bg-opacity-10 text-success">✅ Done</span>
                          ) : (
                            <span className="badge bg-secondary bg-opacity-10 text-secondary">⏳ Pending</span>
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
      </div>
    </div>
  )
}