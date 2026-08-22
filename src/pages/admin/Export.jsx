import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import * as XLSX from 'xlsx'

export default function Export() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

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
    }
    setLoading(false)
  }

  const exportToExcel = () => {
    // Prepare data for Excel
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
    <div className="min-vh-100" style={{ background: '#f0f2f5' }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 fw-bold">Survey Responses</h1>
          <div className="d-flex gap-2">
            <button 
              onClick={exportToExcel}
              className="btn btn-success"
              disabled={feedback.length === 0}
            >
              <svg className="me-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              </svg>
              Export Excel
            </button>
            <button 
              onClick={exportToCSV}
              className="btn btn-secondary"
              disabled={feedback.length === 0}
            >
              <svg className="me-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : feedback.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No survey responses yet</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Rating</th>
                      <th>Engagement</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-medium">{item.guest_name || 'Anonymous'}</td>
                        <td>{item.phone || 'N/A'}</td>
                        <td>{item.location_name || 'Unknown'}</td>
                        <td>
                          <span className={`badge ${item.rating >= 4 ? 'bg-success' : item.rating >= 3 ? 'bg-warning' : 'bg-danger'}`}>
                            {item.rating || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${item.engagement >= 4 ? 'bg-success' : item.engagement >= 3 ? 'bg-warning' : 'bg-danger'}`}>
                            {item.engagement || 'N/A'}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {new Date(item.submitted_at).toLocaleString()}
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