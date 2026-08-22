import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import * as XLSX from 'xlsx'
import { 
  FiDownload, 
  FiFileText, 
  FiFile, 
  FiUsers, 
  FiMapPin, 
  FiStar, 
  FiTrendingUp,
  FiArrowLeft
} from 'react-icons/fi'

export default function Export() {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    avgEngagement: 0,
    topLocation: 'N/A'
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (!error && data) {
      setFeedback(data)
      
      // Calculate stats
      const total = data.length
      const avgRating = total > 0 ? data.reduce((sum, item) => sum + (item.rating || 0), 0) / total : 0
      const avgEngagement = total > 0 ? data.reduce((sum, item) => sum + (item.engagement || 0), 0) / total : 0
      
      // Find top location
      const locationCounts = {}
      data.forEach(item => {
        const loc = item.location_name || 'Unknown'
        locationCounts[loc] = (locationCounts[loc] || 0) + 1
      })
      let topLoc = 'N/A'
      let maxCount = 0
      Object.entries(locationCounts).forEach(([loc, count]) => {
        if (count > maxCount) {
          maxCount = count
          topLoc = loc
        }
      })
      
      setStats({
        total,
        avgRating: Math.round(avgRating * 10) / 10,
        avgEngagement: Math.round(avgEngagement * 10) / 10,
        topLocation: topLoc
      })
    }
    setLoading(false)
  }

  const exportToExcel = () => {
    const exportData = feedback.map(item => ({
      'Guest Name': item.guest_name || 'Anonymous',
      'Phone': item.phone || 'N/A',
      'Location': item.location_name || 'Unknown',
      'Rating': item.rating || 'N/A',
      'Engagement': item.engagement || 'N/A',
      'Favorite Activity': item.favorite_activity || 'N/A',
      'Key Takeaway': item.key_takeaway || 'N/A',
      'Comments': item.comments || 'N/A',
      'Submitted At': new Date(item.submitted_at).toLocaleString()
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')
    XLSX.writeFile(wb, `Survey_Responses_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToCSV = () => {
    const headers = ['Guest Name', 'Phone', 'Location', 'Rating', 'Engagement', 'Favorite Activity', 'Key Takeaway', 'Comments', 'Submitted At']
    const rows = feedback.map(item => [
      item.guest_name || 'Anonymous',
      item.phone || 'N/A',
      item.location_name || 'Unknown',
      item.rating || 'N/A',
      item.engagement || 'N/A',
      item.favorite_activity || 'N/A',
      item.key_takeaway || 'N/A',
      item.comments || 'N/A',
      new Date(item.submitted_at).toLocaleString()
    ])

    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
      csv += row.join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Survey_Responses_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4">
      {/* ✅ Back to Dashboard Button */}
      <button 
        onClick={() => navigate('/admin')}
        className="btn btn-outline-secondary rounded-3 px-3 mb-4 d-inline-flex align-items-center gap-2"
        style={{ transition: 'all 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4f8'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <FiArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </button>

      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#2d3748' }}>
            <span className="me-2">📊</span> Export Responses
          </h4>
          <p className="text-muted small mb-0">Download survey data as Excel or CSV</p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button 
            onClick={exportToExcel}
            className="btn btn-success rounded-3 px-4 d-flex align-items-center gap-2"
            disabled={feedback.length === 0}
            style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}
          >
            <FiFile size={18} />
            <span>Export Excel</span>
          </button>
          <button 
            onClick={exportToCSV}
            className="btn btn-secondary rounded-3 px-4 d-flex align-items-center gap-2"
            disabled={feedback.length === 0}
            style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', border: 'none' }}
          >
            <FiFileText size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      {!loading && feedback.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <FiUsers size={20} className="text-primary" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Total Responses</h6>
                    <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{stats.total}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                    <FiStar size={20} className="text-warning" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Avg Rating</h6>
                    <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{stats.avgRating}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                    <FiTrendingUp size={20} className="text-success" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Avg Engagement</h6>
                    <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{stats.avgEngagement}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(23, 162, 184, 0.1)' }}>
                    <FiMapPin size={20} className="text-info" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Top Location</h6>
                    <h4 className="fw-bold mb-0" style={{ color: '#2d3748', fontSize: '1rem' }}>{stats.topLocation}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 px-4 pt-4 pb-0 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
            <span className="me-2">📋</span> Survey Responses
          </h5>
          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
            {feedback.length} responses
          </span>
        </div>
        <div className="card-body p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Loading responses...</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 text-muted opacity-25 mb-3">📭</div>
              <p className="text-muted mb-0 fw-medium">No survey responses yet</p>
              <p className="text-muted small">Responses will appear here once guests submit surveys</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th className="fw-semibold text-muted small text-uppercase">Guest Name</th>
                    <th className="fw-semibold text-muted small text-uppercase">Phone</th>
                    <th className="fw-semibold text-muted small text-uppercase">Location</th>
                    <th className="fw-semibold text-muted small text-uppercase text-center">Rating</th>
                    <th className="fw-semibold text-muted small text-uppercase text-center">Engagement</th>
                    <th className="fw-semibold text-muted small text-uppercase">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((item) => (
                    <tr key={item.id} style={{ transition: 'background 0.2s' }}>
                      <td className="fw-medium">
                        <span className="d-flex align-items-center gap-2">
                          <span className="text-muted">👤</span>
                          {item.guest_name || 'Anonymous'}
                        </span>
                      </td>
                      <td>
                        <span className="d-flex align-items-center gap-1">
                          <span className="text-muted">📱</span>
                          {item.phone || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="d-flex align-items-center gap-1">
                          <span className="text-muted">📍</span>
                          {item.location_name || 'Unknown'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge px-3 py-2 rounded-pill ${
                          item.rating >= 4 ? 'bg-success bg-opacity-10 text-success' : 
                          item.rating >= 3 ? 'bg-warning bg-opacity-10 text-warning' : 
                          'bg-danger bg-opacity-10 text-danger'
                        }`}>
                          {item.rating || 'N/A'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge px-3 py-2 rounded-pill ${
                          item.engagement >= 4 ? 'bg-success bg-opacity-10 text-success' : 
                          item.engagement >= 3 ? 'bg-warning bg-opacity-10 text-warning' : 
                          'bg-danger bg-opacity-10 text-danger'
                        }`}>
                          {item.engagement || 'N/A'}
                        </span>
                      </td>
                      <td className="text-muted small">
                        <span className="d-flex align-items-center gap-1">
                          <span>📅</span>
                          {new Date(item.submitted_at).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <small className="text-muted">
          {feedback.length > 0 && `Showing ${feedback.length} responses • Last updated: ${new Date().toLocaleString()}`}
        </small>
      </div>
    </div>
  )
}