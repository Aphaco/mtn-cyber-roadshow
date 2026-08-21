import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

export default function RegisterGuest() {
  const [phone, setPhone] = useState('')
  const [locationId, setLocationId] = useState('')
  const [locations, setLocations] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load locations
  useEffect(() => {
    const loadLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name')
        .order('name')
      
      if (!error && data) {
        setLocations(data)
      }
      setLoadingLocations(false)
    }
    
    loadLocations()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    // Validate phone (Ghana format)
    const phoneRegex = /^0[0-9]{9}$/
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid Ghana phone number (e.g., 0241234567)')
      setSubmitting(false)
      return
    }

    try {
      // 1. Save guest to Supabase
      const { data: guestData, error: insertError } = await supabase
        .from('guests')
        .insert([
          { 
            phone: phone,
            location_id: locationId,
            sms_status: 'pending'
          }
        ])
        .select()
        .single()

      if (insertError) {
        // Check for duplicate phone number
        if (insertError.code === '23505') {
          setError('This phone number is already registered.')
        } else {
          throw insertError
        }
        setSubmitting(false)
        return
      }

      // 2. Send survey via SMS using Edge Function
      const { data: smsData, error: smsError } = await supabase.functions.invoke('send-survey', {
        body: { guestId: guestData.id },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (smsError) {
        console.error('SMS Error:', smsError)
        setError('Guest registered but survey SMS failed to send. Please try again.')
      } else {
        setSuccess('✅ Guest registered! Survey link sent via SMS.')
      }

      // Clear form
      setPhone('')
      setLocationId('')

    } catch (error) {
      console.error('Registration error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '70px', height: '70px' }}>
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h1 className="text-white fw-bold display-6">Register Guest</h1>
              <p className="text-white-50">MTN Cyber Roadshow • Ghana</p>
            </div>

            {/* Card */}
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-lg-5">
                <form onSubmit={handleSubmit}>
                  {/* Phone Number */}
                  <div className="mb-4">
                    <label htmlFor="phone" className="form-label fw-semibold text-secondary">
                      Guest Mobile Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <svg width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
                          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                        </svg>
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        className="form-control form-control-lg border-start-0"
                        placeholder="0241234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        required
                      />
                    </div>
                    <small className="text-muted">Format: 024XXXXXXX (Ghana number)</small>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <label htmlFor="location" className="form-label fw-semibold text-secondary">
                      Roadshow Location <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <svg width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                      </span>
                      <select
                        id="location"
                        className="form-select form-select-lg border-start-0"
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        disabled={loadingLocations}
                        required
                      >
                        <option value="">
                          {loadingLocations ? 'Loading locations...' : 'Select location'}
                        </option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center border-0 rounded-3" role="alert">
                      <svg className="bi flex-shrink-0 me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 4h2v5H7V4zm0 7h2v2H7v-2z"/>
                      </svg>
                      <div>{error}</div>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="alert alert-success d-flex align-items-center border-0 rounded-3" role="alert">
                      <svg className="bi flex-shrink-0 me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                      <div>{success}</div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-semibold"
                    disabled={submitting || loadingLocations}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        <svg className="me-2" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        Register Guest
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    By registering, you agree to receive a survey link via SMS
                  </small>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mt-3">
              <div className="col-4">
                <div className="card border-0 bg-white bg-opacity-15 text-center py-2 text-white">
                  <div className="card-body py-1">
                    <h5 className="h4 fw-bold mb-0">4</h5>
                    <small className="text-white-50">Cities</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card border-0 bg-white bg-opacity-15 text-center py-2 text-white">
                  <div className="card-body py-1">
                    <h5 className="h4 fw-bold mb-0">100+</h5>
                    <small className="text-white-50">Attendees</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card border-0 bg-white bg-opacity-15 text-center py-2 text-white">
                  <div className="card-body py-1">
                    <h5 className="h4 fw-bold mb-0">MTN</h5>
                    <small className="text-white-50">Cyber Roadshow</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}