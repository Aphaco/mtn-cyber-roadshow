import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function RegisterGuest() {
  const navigate = useNavigate()
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
      // 1. Generate a unique survey token BEFORE saving
      const surveyToken = crypto.randomUUID()
      console.log('Generated survey token:', surveyToken)

      // 2. Save guest to Supabase with the generated token
      const { data: guestData, error: insertError } = await supabase
        .from('guests')
        .insert([
          { 
            phone: phone,
            location_id: locationId,
            survey_token: surveyToken,
            sms_status: 'pending'
          }
        ])
        .select()
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This phone number is already registered.')
        } else {
          console.error('Insert error:', insertError)
          throw insertError
        }
        setSubmitting(false)
        return
      }

      console.log('Guest created with token:', guestData.survey_token)

      // 3. Send survey via SMS using Edge Function
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
        console.log('SMS Response:', smsData)
        setSuccess('✅ Guest registered! Survey link sent via SMS.')
      }

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ 
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
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)',
        top: '-250px',
        right: '-200px',
        animation: 'float1 12s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.10) 0%, transparent 70%)',
        bottom: '-150px',
        left: '-150px',
        animation: 'float2 14s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 193, 7, 0.06) 0%, transparent 70%)',
        top: '60%',
        left: '20%',
        animation: 'pulse 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(40, 167, 69, 0.06) 0%, transparent 70%)',
        bottom: '30%',
        right: '10%',
        animation: 'pulse 8s ease-in-out infinite 2s'
      }}></div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 30px) scale(1.15); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7 col-xl-6">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/admin')}
              className="btn btn-outline-light rounded-3 px-4 mb-4 d-inline-flex align-items-center gap-2"
              style={{ 
                transition: 'all 0.3s ease',
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.7)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
              Back to Dashboard
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="bg-white rounded-4 d-inline-flex align-items-center justify-content-center mb-3 shadow-lg" style={{ 
                width: '80px', 
                height: '80px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h1 className="text-white fw-bold mb-1" style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Register Guest</h1>
              <p className="text-white-50" style={{ fontSize: '14px' }}>MTN Cyber Roadshow • Ghana</p>
            </div>

            {/* Card */}
            <div className="card border-0 shadow-lg rounded-4" style={{
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div className="card-body p-4 p-lg-5">
                {/* Form Title */}
                <div className="text-center mb-4">
                  <h5 className="fw-bold mb-1" style={{ color: '#2d3748' }}>New Registration</h5>
                  <p className="text-muted small mb-0">Enter guest details to send survey link</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Phone Number */}
                  <div className="mb-4">
                    <label htmlFor="phone" className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '13px' }}>
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                        <svg width="18" height="18" fill="#a0aec0" viewBox="0 0 16 16">
                          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                        </svg>
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        className="form-control form-control-lg border-start-0"
                        style={{ borderRadius: '0 12px 12px 0' }}
                        placeholder="0241234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        required
                      />
                    </div>
                    <small className="text-muted" style={{ fontSize: '12px' }}>Format: 024XXXXXXX (Ghana number)</small>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <label htmlFor="location" className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '13px' }}>
                      Roadshow Location <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                        <svg width="18" height="18" fill="#a0aec0" viewBox="0 0 16 16">
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                      </span>
                      <select
                        id="location"
                        className="form-select form-select-lg border-start-0"
                        style={{ borderRadius: '0 12px 12px 0' }}
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

                  {/* Success Message */}
                  {success && (
                    <div className="alert alert-success d-flex align-items-center border-0 rounded-3" role="alert" style={{ 
                      background: '#f0fff4',
                      color: '#38a169',
                      fontSize: '14px'
                    }}>
                      <svg className="bi flex-shrink-0 me-2" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
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
                  <small className="text-muted" style={{ fontSize: '12px' }}>
                    By registering, you agree to receive a survey link via SMS
                  </small>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mt-3">
              <div className="col-4">
                <div className="card border-0 text-center py-3 text-white" style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  <div className="card-body py-1">
                    <h4 className="fw-bold mb-0" style={{ fontSize: '24px' }}>4</h4>
                    <small className="text-white-50" style={{ fontSize: '11px' }}>Cities</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card border-0 text-center py-3 text-white" style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  <div className="card-body py-1">
                    <h4 className="fw-bold mb-0" style={{ fontSize: '24px' }}>100+</h4>
                    <small className="text-white-50" style={{ fontSize: '11px' }}>Attendees</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card border-0 text-center py-3 text-white" style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  <div className="card-body py-1">
                    <h4 className="fw-bold mb-0" style={{ fontSize: '24px' }}>MTN</h4>
                    <small className="text-white-50" style={{ fontSize: '11px' }}>Cyber Roadshow</small>
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