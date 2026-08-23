import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { supabase } from '../../services/supabase'

export default function Survey() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [guest, setGuest] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    engagement: 5,
    favoriteActivity: '',
    keyTakeaway: '',
    comments: ''
  })

  // Fetch guest data using secure RPC function
  useEffect(() => {
    const fetchGuest = async () => {
      try {
        console.log('🔍 Fetching guest with token:', token)

        if (!token) {
          setError('No survey token provided.')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.rpc(
          'get_guest_for_survey',
          {
            p_token: token,
          }
        )

        if (error) {
          console.error('❌ RPC error:', error)
          setError('Database error: ' + error.message)
          setLoading(false)
          return
        }

        console.log('✅ RPC response:', data)

        const guestData = data?.[0]

        if (!guestData) {
          console.log('❌ No guest found for token:', token)
          setError('Guest not found. Please check your survey link.')
          setLoading(false)
          return
        }

        console.log('✅ Guest found:', guestData)
        setGuest(guestData)

        // ✅ REMOVED: Don't set submitted here - let the form handle it

      } catch (error) {
        console.error('❌ Unexpected error:', error)
        setError('An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchGuest()
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ✅ UPDATED: Submit and navigate to Thank You
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Call the secure RPC function
      const { data, error } = await supabase.rpc('submit_survey', {
        p_token: token,
        p_name: formData.name,
        p_rating: formData.rating,
        p_engagement: formData.engagement,
        p_favorite_activity: formData.favoriteActivity,
        p_key_takeaway: formData.keyTakeaway,
        p_comments: formData.comments
      })

      if (error) {
        console.error('RPC error:', error)
        throw new Error(error.message)
      }

      if (data && data.success === false) {
        throw new Error(data.error || 'Submission failed')
      }

      console.log('✅ Survey submitted successfully:', data)

      // ✅ Navigate to Thank You page immediately
      navigate('/thank-you')

    } catch (error) {
      console.error('Survey submission error:', error)
      alert('Something went wrong: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading survey...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="display-1 mb-3">🔍</div>
          <h1 className="h3 fw-bold">Survey Not Found</h1>
          <p className="text-muted">{error}</p>
          <p className="text-muted small">Token: {token}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-link text-primary mt-2"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  // Survey form
  return (
    <div className="min-vh-100 py-5" style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="h2 fw-bold">MTN Cyber Roadshow</h1>
              <p className="text-muted">Thank you for attending! Please share your feedback.</p>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                📍 {guest?.location_name || 'Roadshow'}
              </span>
            </div>

            {/* Survey Form */}
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Your Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      How would you rate the roadshow? <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`btn flex-grow-1 py-2 fw-bold ${
                            formData.rating === num
                              ? 'btn-primary active'
                              : 'btn-outline-secondary'
                          }`}
                          onClick={() => setFormData({ ...formData, rating: num })}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">Poor</small>
                      <small className="text-muted">Excellent</small>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      How engaging was the presentation?
                    </label>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`btn flex-grow-1 py-2 fw-bold ${
                            formData.engagement === num
                              ? 'btn-primary active'
                              : 'btn-outline-secondary'
                          }`}
                          onClick={() => setFormData({ ...formData, engagement: num })}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">Not Engaging</small>
                      <small className="text-muted">Very Engaging</small>
                    </div>
                  </div>

                  {/* Favorite Activity */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      What was your favorite activity?
                    </label>
                    <select
                      name="favoriteActivity"
                      className="form-select form-select-lg"
                      value={formData.favoriteActivity}
                      onChange={handleChange}
                    >
                      <option value="">Select an activity...</option>
                      <option value="Cybersecurity Quiz">Cybersecurity Quiz</option>
                      <option value="Hacking Demo">Hacking Demo</option>
                      <option value="Networking Session">Networking Session</option>
                      <option value="Expert Talk">Expert Talk</option>
                      <option value="Product Showcase">Product Showcase</option>
                    </select>
                  </div>

                  {/* Key Takeaway */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      What's your key takeaway?
                    </label>
                    <textarea
                      name="keyTakeaway"
                      className="form-control"
                      rows="2"
                      placeholder="What did you learn today?"
                      value={formData.keyTakeaway}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Comments */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Additional Comments
                    </label>
                    <textarea
                      name="comments"
                      className="form-control"
                      rows="3"
                      placeholder="Any other feedback?"
                      value={formData.comments}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-semibold"
                    disabled={submitting}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <small className="text-muted">MTN Cyber Roadshow • Powered by SMSOnlineGH</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}