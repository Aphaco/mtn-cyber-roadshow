// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { supabase } from '../../services/supabase'
// import * as XLSX from 'xlsx'
// import { 
//   FiDownload, 
//   FiFileText, 
//   FiFile, 
//   FiUsers, 
//   FiMapPin, 
//   FiStar, 
//   FiTrendingUp,
//   FiArrowLeft,
//   FiX
// } from 'react-icons/fi'

// export default function Export() {
//   const navigate = useNavigate()
//   const [feedback, setFeedback] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [stats, setStats] = useState({
//     total: 0,
//     avgRating: 0,
//     avgEngagement: 0,
//     topLocation: 'N/A'
//   })

//   // ✅ Region selection modal state
//   const [modalOpen, setModalOpen] = useState(false)
//   const [exportType, setExportType] = useState(null) // 'excel' | 'csv'
//   const [allRegions, setAllRegions] = useState(true)
//   const [selectedRegions, setSelectedRegions] = useState([])
//   const [exporting, setExporting] = useState(false)

//   useEffect(() => {
//     fetchFeedback()
//   }, [])

//   const fetchFeedback = async () => {
//     const { data, error } = await supabase
//       .from('feedback')
//       .select('*')
//       .order('submitted_at', { ascending: false })

//     if (!error && data) {
//       setFeedback(data)
      
//       const total = data.length
//       const avgRating = total > 0 ? data.reduce((sum, item) => sum + (item.rating || 0), 0) / total : 0
//       const avgEngagement = total > 0 ? data.reduce((sum, item) => sum + (item.engagement || 0), 0) / total : 0
      
//       const locationCounts = {}
//       data.forEach(item => {
//         const loc = item.location_name || 'Unknown'
//         locationCounts[loc] = (locationCounts[loc] || 0) + 1
//       })
//       let topLoc = 'N/A'
//       let maxCount = 0
//       Object.entries(locationCounts).forEach(([loc, count]) => {
//         if (count > maxCount) {
//           maxCount = count
//           topLoc = loc
//         }
//       })
      
//       setStats({
//         total,
//         avgRating: Math.round(avgRating * 10) / 10,
//         avgEngagement: Math.round(avgEngagement * 10) / 10,
//         topLocation: topLoc
//       })
//     }
//     setLoading(false)
//   }

//   // ✅ Derive region list from data (so it always matches what's actually in the DB)
//   const availableRegions = Array.from(
//     new Set(feedback.map(item => item.location_name).filter(Boolean))
//   ).sort()

//   // ---- Modal controls ----
//   const openExportModal = (type) => {
//     setExportType(type)
//     setAllRegions(true)
//     setSelectedRegions([])
//     setModalOpen(true)
//   }

//   const closeModal = () => {
//     if (exporting) return
//     setModalOpen(false)
//   }

//   const toggleRegion = (region) => {
//     setSelectedRegions(prev =>
//       prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
//     )
//   }

//   const handleAllToggle = () => {
//     const next = !allRegions
//     setAllRegions(next)
//     if (next) setSelectedRegions([])
//   }

//   // ---- Shared export logic ----
//   const getFilteredData = () => {
//     if (allRegions) return feedback
//     return feedback.filter(item => selectedRegions.includes(item.location_name))
//   }

//   const getRegionLabel = () => {
//     if (allRegions) return 'All_Regions'
//     if (selectedRegions.length === 0) return null
//     return selectedRegions.join('_').replace(/\s+/g, '_')
//   }

//   const buildExportRows = (data) =>
//     data.map(item => ({
//       'Guest Name': item.guest_name || 'Anonymous',
//       'Phone': item.phone || 'N/A',
//       'Location': item.location_name || 'Unknown',
//       'Rating': item.rating || 'N/A',
//       'Engagement': item.engagement || 'N/A',
//       'Favorite Activity': item.favorite_activity || 'N/A',
//       'Key Takeaway': item.key_takeaway || 'N/A',
//       'Comments': item.comments || 'N/A',
//       'Submitted At': new Date(item.submitted_at).toLocaleString()
//     }))

//   const runExport = () => {
//     const label = getRegionLabel()
//     if (!label) {
//       alert('Please select at least one region.')
//       return
//     }

//     const data = getFilteredData()
//     if (data.length === 0) {
//       alert('No survey responses found for the selected region(s).')
//       return
//     }

//     setExporting(true)
//     try {
//       const dateStr = new Date().toISOString().split('T')[0]
//       const baseName = `Survey_Responses_${label}_${dateStr}`
//       const exportData = buildExportRows(data)

//       if (exportType === 'excel') {
//         const ws = XLSX.utils.json_to_sheet(exportData)
//         const wb = XLSX.utils.book_new()
//         XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')
//         XLSX.writeFile(wb, `${baseName}.xlsx`)
//       } else {
//         const headers = ['Guest Name', 'Phone', 'Location', 'Rating', 'Engagement', 'Favorite Activity', 'Key Takeaway', 'Comments', 'Submitted At']
//         const rows = data.map(item => [
//           item.guest_name || 'Anonymous',
//           item.phone || 'N/A',
//           item.location_name || 'Unknown',
//           item.rating || 'N/A',
//           item.engagement || 'N/A',
//           item.favorite_activity || 'N/A',
//           item.key_takeaway || 'N/A',
//           item.comments || 'N/A',
//           new Date(item.submitted_at).toLocaleString()
//         ])

//         // Wrap each cell in quotes so commas in comments don't break the CSV
//         const escapeCell = (val) => `"${String(val).replace(/"/g, '""')}"`
//         let csv = headers.map(escapeCell).join(',') + '\n'
//         rows.forEach(row => {
//           csv += row.map(escapeCell).join(',') + '\n'
//         })

//         const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.href = url
//         a.download = `${baseName}.csv`
//         a.click()
//         window.URL.revokeObjectURL(url)
//       }

//       setModalOpen(false)
//     } catch (err) {
//       console.error('Export error:', err)
//       alert('Export failed: ' + err.message)
//     } finally {
//       setExporting(false)
//     }
//   }

//   const previewCount = allRegions
//     ? feedback.length
//     : feedback.filter(i => selectedRegions.includes(i.location_name)).length

//   return (
//     <div className="p-4">
//       {/* ✅ Back to Dashboard Button */}
//       <button 
//         onClick={() => navigate('/admin')}
//         className="btn btn-outline-secondary rounded-3 px-3 mb-4 d-inline-flex align-items-center gap-2"
//         style={{ transition: 'all 0.2s' }}
//         onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4f8'}
//         onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//       >
//         <FiArrowLeft size={18} />
//         <span>Back to Dashboard</span>
//       </button>

//       {/* Page Header */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="fw-bold mb-1" style={{ color: '#2d3748' }}>
//             <span className="me-2">📊</span> Export Responses
//           </h4>
//           <p className="text-muted small mb-0">Download survey data as Excel or CSV</p>
//         </div>
//         <div className="d-flex gap-2 mt-2 mt-sm-0">
//           <button 
//             onClick={() => openExportModal('excel')}
//             className="btn btn-success rounded-3 px-4 d-flex align-items-center gap-2"
//             disabled={feedback.length === 0}
//             style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}
//           >
//             <FiFile size={18} />
//             <span>Export Excel</span>
//           </button>
//           <button 
//             onClick={() => openExportModal('csv')}
//             className="btn btn-secondary rounded-3 px-4 d-flex align-items-center gap-2"
//             disabled={feedback.length === 0}
//             style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', border: 'none' }}
//           >
//             <FiFileText size={18} />
//             <span>Export CSV</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats Summary Cards */}
//       {!loading && feedback.length > 0 && (
//         <div className="row g-3 mb-4">
//           <div className="col-6 col-md-3">
//             <div className="card border-0 shadow-sm rounded-4">
//               <div className="card-body p-3">
//                 <div className="d-flex align-items-center">
//                   <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
//                     <FiUsers size={20} className="text-primary" />
//                   </div>
//                   <div>
//                     <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Total Responses</h6>
//                     <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{stats.total}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-6 col-md-3">
//             <div className="card border-0 shadow-sm rounded-4">
//               <div className="card-body p-3">
//                 <div className="d-flex align-items-center">
//                   <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
//                     <FiStar size={20} className="text-warning" />
//                   </div>
//                   <div>
//                     <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Avg Rating</h6>
//                     <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{stats.avgRating}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-6 col-md-3">
//             <div className="card border-0 shadow-sm rounded-4">
//               <div className="card-body p-3">
//                 <div className="d-flex align-items-center">
//                   <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
//                     <FiTrendingUp size={20} className="text-success" />
//                   </div>
//                   <div>
//                     <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Avg Engagement</h6>
//                     <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>{stats.avgEngagement}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-6 col-md-3">
//             <div className="card border-0 shadow-sm rounded-4">
//               <div className="card-body p-3">
//                 <div className="d-flex align-items-center">
//                   <div className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(23, 162, 184, 0.1)' }}>
//                     <FiMapPin size={20} className="text-info" />
//                   </div>
//                   <div>
//                     <h6 className="text-muted mb-0 small text-uppercase fw-semibold">Top Location</h6>
//                     <h4 className="fw-bold mb-0" style={{ color: '#2d3748', fontSize: '1rem' }}>{stats.topLocation}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Data Table */}
//       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//         <div className="card-header bg-white border-0 px-4 pt-4 pb-0 d-flex align-items-center justify-content-between">
//           <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
//             <span className="me-2">📋</span> Survey Responses
//           </h5>
//           <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
//             {feedback.length} responses
//           </span>
//         </div>
//         <div className="card-body p-4">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="text-muted mt-3">Loading responses...</p>
//             </div>
//           ) : feedback.length === 0 ? (
//             <div className="text-center py-5">
//               <div className="display-1 text-muted opacity-25 mb-3">📭</div>
//               <p className="text-muted mb-0 fw-medium">No survey responses yet</p>
//               <p className="text-muted small">Responses will appear here once guests submit surveys</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead style={{ background: '#f8f9fa' }}>
//                   <tr>
//                     <th className="fw-semibold text-muted small text-uppercase">Guest Name</th>
//                     <th className="fw-semibold text-muted small text-uppercase">Phone</th>
//                     <th className="fw-semibold text-muted small text-uppercase">Location</th>
//                     <th className="fw-semibold text-muted small text-uppercase text-center">Rating</th>
//                     <th className="fw-semibold text-muted small text-uppercase text-center">Engagement</th>
//                     <th className="fw-semibold text-muted small text-uppercase">Submitted</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {feedback.map((item) => (
//                     <tr key={item.id} style={{ transition: 'background 0.2s' }}>
//                       <td className="fw-medium">
//                         <span className="d-flex align-items-center gap-2">
//                           <span className="text-muted">👤</span>
//                           {item.guest_name || 'Anonymous'}
//                         </span>
//                       </td>
//                       <td>
//                         <span className="d-flex align-items-center gap-1">
//                           <span className="text-muted">📱</span>
//                           {item.phone || 'N/A'}
//                         </span>
//                       </td>
//                       <td>
//                         <span className="d-flex align-items-center gap-1">
//                           <span className="text-muted">📍</span>
//                           {item.location_name || 'Unknown'}
//                         </span>
//                       </td>
//                       <td className="text-center">
//                         <span className={`badge px-3 py-2 rounded-pill ${
//                           item.rating >= 4 ? 'bg-success bg-opacity-10 text-success' : 
//                           item.rating >= 3 ? 'bg-warning bg-opacity-10 text-warning' : 
//                           'bg-danger bg-opacity-10 text-danger'
//                         }`}>
//                           {item.rating || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="text-center">
//                         <span className={`badge px-3 py-2 rounded-pill ${
//                           item.engagement >= 4 ? 'bg-success bg-opacity-10 text-success' : 
//                           item.engagement >= 3 ? 'bg-warning bg-opacity-10 text-warning' : 
//                           'bg-danger bg-opacity-10 text-danger'
//                         }`}>
//                           {item.engagement || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="text-muted small">
//                         <span className="d-flex align-items-center gap-1">
//                           <span>📅</span>
//                           {new Date(item.submitted_at).toLocaleString()}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-4 text-center">
//         <small className="text-muted">
//           {feedback.length > 0 && `Showing ${feedback.length} responses • Last updated: ${new Date().toLocaleString()}`}
//         </small>
//       </div>

//       {/* ✅ Region Selection Modal */}
//       {modalOpen && (
//         <div
//           onClick={closeModal}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             background: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1050,
//             padding: '1rem'
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-4 shadow-lg"
//             style={{ width: '100%', maxWidth: '440px' }}
//           >
//             {/* Modal Header */}
//             <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
//               <div>
//                 <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
//                   Select Survey Region(s)
//                 </h5>
//                 <small className="text-muted">
//                   Format: <strong>{exportType === 'excel' ? 'Excel (.xlsx)' : 'CSV (.csv)'}</strong>
//                 </small>
//               </div>
//               <button
//                 onClick={closeModal}
//                 className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
//                 style={{ width: 32, height: 32 }}
//                 disabled={exporting}
//               >
//                 <FiX size={16} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="px-4 py-3">
//               <label className="d-flex align-items-center gap-2 py-2 fw-semibold" style={{ cursor: 'pointer' }}>
//                 <input
//                   type="checkbox"
//                   className="form-check-input mt-0"
//                   checked={allRegions}
//                   onChange={handleAllToggle}
//                 />
//                 All Regions
//               </label>

//               <hr className="my-2" />

//               {availableRegions.length === 0 ? (
//                 <p className="text-muted small mb-0">No regions available.</p>
//               ) : (
//                 availableRegions.map(region => (
//                   <label
//                     key={region}
//                     className="d-flex align-items-center gap-2 py-2"
//                     style={{ cursor: allRegions ? 'not-allowed' : 'pointer', opacity: allRegions ? 0.5 : 1 }}
//                   >
//                     <input
//                       type="checkbox"
//                       className="form-check-input mt-0"
//                       disabled={allRegions}
//                       checked={selectedRegions.includes(region)}
//                       onChange={() => toggleRegion(region)}
//                     />
//                     {region}
//                   </label>
//                 ))
//               )}

//               <div className="mt-3 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
//                 <small className="text-muted">
//                   Will export <strong className="text-dark">{previewCount}</strong> response{previewCount === 1 ? '' : 's'}
//                   {!allRegions && selectedRegions.length > 0 && (
//                     <> from <strong className="text-dark">{selectedRegions.join(', ')}</strong></>
//                   )}
//                 </small>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="d-flex justify-content-end gap-2 px-4 pb-4">
//               <button
//                 onClick={closeModal}
//                 className="btn btn-outline-secondary rounded-3 px-4"
//                 disabled={exporting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={runExport}
//                 className="btn rounded-3 px-4 text-white"
//                 disabled={exporting || (!allRegions && selectedRegions.length === 0)}
//                 style={{
//                   background: exportType === 'excel'
//                     ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
//                     : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
//                   border: 'none'
//                 }}
//               >
//                 {exporting ? 'Exporting...' : 'Export Selected'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import * as XLSX from 'xlsx'
import { 
  FiFileText, 
  FiFile, 
  FiUsers, 
  FiMapPin, 
  FiStar, 
  FiTrendingUp,
  FiArrowLeft,
  FiX
} from 'react-icons/fi'

export default function Export() {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState([])
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    avgEngagement: 0,
    topLocation: 'N/A'
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [exportType, setExportType] = useState(null)
  const [allRegions, setAllRegions] = useState(true)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchFeedback()
    fetchGuests()
  }, [])

  // ---------- FEEDBACK ----------
  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (!error && data) {
      setFeedback(data)
      
      const total = data.length
      const avgRating = total > 0 ? data.reduce((sum, item) => sum + (item.rating || 0), 0) / total : 0
      const avgEngagement = total > 0 ? data.reduce((sum, item) => sum + (item.engagement || 0), 0) / total : 0
      
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

  // ---------- GUESTS ----------
  // Two-query approach. Forces String() on both sides of the lookup
  // so int8-as-string vs int8-as-number can never mismatch.
  const fetchGuests = async () => {
    const { data: guestRows, error: gErr } = await supabase
      .from('guests')
      .select('id, survey_completed, location_id')

    if (gErr) {
      return
    }

    const { data: locRows, error: lErr } = await supabase
      .from('locations')
      .select('id, name')

    if (lErr) {
      return
    }

    // Build map — keys stored as strings
    const locMap = {}
    ;(locRows || []).forEach(l => {
      locMap[String(l.id)] = l.name
    })

    // Merge — lookup with strings too
    const merged = (guestRows || []).map(g => ({
      id: g.id,
      survey_completed: g.survey_completed,
      location_id: g.location_id,
      region: locMap[String(g.location_id)] || 'Unknown'
    }))

    setGuests(merged)
  }

  const availableRegions = Array.from(
    new Set(feedback.map(item => item.location_name).filter(Boolean))
  ).sort()

  // ---------- MODAL CONTROLS ----------
  const openExportModal = (type) => {
    setExportType(type)
    setAllRegions(true)
    setSelectedRegions([])
    setModalOpen(true)
  }

  const closeModal = () => {
    if (exporting) return
    setModalOpen(false)
  }

  const toggleRegion = (region) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  const handleAllToggle = () => {
    const next = !allRegions
    setAllRegions(next)
    if (next) setSelectedRegions([])
  }

  // ---------- FILTERING ----------
  const getFilteredFeedback = () => {
    if (allRegions) return feedback
    return feedback.filter(item => selectedRegions.includes(item.location_name))
  }

  const getFilteredGuests = () => {
    if (allRegions) return guests
    return guests.filter(g => selectedRegions.includes(g.region))
  }

  const getRegionLabel = () => {
    if (allRegions) return 'All_Regions'
    if (selectedRegions.length === 0) return null
    return selectedRegions.join('_').replace(/\s+/g, '_')
  }

  // ---------- REGION SUMMARY ----------
  const buildRegionSummary = () => {
    const filtered = getFilteredGuests()
    const summary = {}

    filtered.forEach(g => {
      const region = g.region || 'Unknown'
      if (!summary[region]) summary[region] = { registered: 0, completed: 0 }
      summary[region].registered += 1
      if (g.survey_completed === true) summary[region].completed += 1
    })

    const rows = Object.entries(summary)
      .map(([region, s]) => ({
        Region: region,
        'Registered': s.registered,
        'Completed Survey': s.completed,
        'Response Rate (%)': s.registered > 0
          ? Math.round((s.completed / s.registered) * 1000) / 10
          : 0
      }))
      .sort((a, b) => a.Region.localeCompare(b.Region))

    const totalReg = rows.reduce((a, r) => a + r.Registered, 0)
    const totalCom = rows.reduce((a, r) => a + r['Completed Survey'], 0)
    rows.push({
      Region: 'TOTAL',
      'Registered': totalReg,
      'Completed Survey': totalCom,
      'Response Rate (%)': totalReg > 0
        ? Math.round((totalCom / totalReg) * 1000) / 10
        : 0
    })

    return rows
  }

  const buildExportRows = (data) =>
    data.map(item => ({
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

  // ---------- EXPORT ----------
  const runExport = () => {
    const label = getRegionLabel()
    if (!label) {
      alert('Please select at least one region.')
      return
    }

    const data = getFilteredFeedback()
    if (data.length === 0) {
      alert('No survey responses found for the selected region(s).')
      return
    }

    setExporting(true)
    try {
      const dateStr = new Date().toISOString().split('T')[0]
      const baseName = `Survey_Responses_${label}_${dateStr}`
      const exportData = buildExportRows(data)
      const summaryRows = buildRegionSummary()

      if (exportType === 'excel') {
        const wb = XLSX.utils.book_new()

        const summaryWs = XLSX.utils.json_to_sheet(summaryRows)
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Campaign Summary')

        const ws = XLSX.utils.json_to_sheet(exportData)
        XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')

        XLSX.writeFile(wb, `${baseName}.xlsx`)
      } else {
        const escapeCell = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`

        let csv = ''

        csv += 'CAMPAIGN SUMMARY\n'
        const summaryHeaders = ['Region', 'Registered', 'Completed Survey', 'Response Rate (%)']
        csv += summaryHeaders.map(escapeCell).join(',') + '\n'
        summaryRows.forEach(row => {
          csv += [
            row.Region,
            row.Registered,
            row['Completed Survey'],
            row['Response Rate (%)']
          ].map(escapeCell).join(',') + '\n'
        })

        csv += '\n'

        csv += 'SURVEY RESPONSES\n'
        const headers = ['Guest Name', 'Phone', 'Location', 'Rating', 'Engagement', 'Favorite Activity', 'Key Takeaway', 'Comments', 'Submitted At']
        csv += headers.map(escapeCell).join(',') + '\n'
        data.forEach(item => {
          csv += [
            item.guest_name || 'Anonymous',
            item.phone || 'N/A',
            item.location_name || 'Unknown',
            item.rating || 'N/A',
            item.engagement || 'N/A',
            item.favorite_activity || 'N/A',
            item.key_takeaway || 'N/A',
            item.comments || 'N/A',
            new Date(item.submitted_at).toLocaleString()
          ].map(escapeCell).join(',') + '\n'
        })

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${baseName}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }

      setModalOpen(false)
    } catch (err) {
      alert('Export failed: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  const previewCount = allRegions
    ? feedback.length
    : feedback.filter(i => selectedRegions.includes(i.location_name)).length

  const modalSummary = buildRegionSummary()

  return (
    <div className="p-4">
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

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#2d3748' }}>
            <span className="me-2">📊</span> Export Responses
          </h4>
          <p className="text-muted small mb-0">Download survey data as Excel or CSV</p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button 
            onClick={() => openExportModal('excel')}
            className="btn btn-success rounded-3 px-4 d-flex align-items-center gap-2"
            disabled={feedback.length === 0}
            style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}
          >
            <FiFile size={18} />
            <span>Export Excel</span>
          </button>
          <button 
            onClick={() => openExportModal('csv')}
            className="btn btn-secondary rounded-3 px-4 d-flex align-items-center gap-2"
            disabled={feedback.length === 0}
            style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', border: 'none' }}
          >
            <FiFileText size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

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

      <div className="mt-4 text-center">
        <small className="text-muted">
          {feedback.length > 0 && `Showing ${feedback.length} responses • Last updated: ${new Date().toLocaleString()}`}
        </small>
      </div>

      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-4 shadow-lg"
            style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
              <div>
                <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
                  Select Survey Region(s)
                </h5>
                <small className="text-muted">
                  Format: <strong>{exportType === 'excel' ? 'Excel (.xlsx)' : 'CSV (.csv)'}</strong>
                </small>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
                disabled={exporting}
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="px-4 py-3">
              <label className="d-flex align-items-center gap-2 py-2 fw-semibold" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="form-check-input mt-0"
                  checked={allRegions}
                  onChange={handleAllToggle}
                />
                All Regions
              </label>

              <hr className="my-2" />

              {availableRegions.length === 0 ? (
                <p className="text-muted small mb-0">No regions available.</p>
              ) : (
                availableRegions.map(region => (
                  <label
                    key={region}
                    className="d-flex align-items-center gap-2 py-2"
                    style={{ cursor: allRegions ? 'not-allowed' : 'pointer', opacity: allRegions ? 0.5 : 1 }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      disabled={allRegions}
                      checked={selectedRegions.includes(region)}
                      onChange={() => toggleRegion(region)}
                    />
                    {region}
                  </label>
                ))
              )}

              <div className="mt-3 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                <div className="fw-semibold small text-uppercase text-muted mb-2">
                  Export Preview
                </div>
                <table className="table table-sm mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr className="text-muted">
                      <th>Region</th>
                      <th className="text-end">Reg.</th>
                      <th className="text-end">Comp.</th>
                      <th className="text-end">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalSummary.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-muted small text-center py-2">
                          No guests found for the selected region(s).
                        </td>
                      </tr>
                    ) : (
                      modalSummary.map((row, i) => (
                        <tr key={i} className={row.Region === 'TOTAL' ? 'fw-bold' : ''}>
                          <td>{row.Region}</td>
                          <td className="text-end">{row.Registered}</td>
                          <td className="text-end">{row['Completed Survey']}</td>
                          <td className="text-end">{row['Response Rate (%)']}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 px-4 pb-4">
              <button
                onClick={closeModal}
                className="btn btn-outline-secondary rounded-3 px-4"
                disabled={exporting}
              >
                Cancel
              </button>
              <button
                onClick={runExport}
                className="btn rounded-3 px-4 text-white"
                disabled={exporting || (!allRegions && selectedRegions.length === 0)}
                style={{
                  background: exportType === 'excel'
                    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                    : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  border: 'none'
                }}
              >
                {exporting ? 'Exporting...' : 'Export Selected'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}