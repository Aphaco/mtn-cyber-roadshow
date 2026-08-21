import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function ProtectedRoute() {
  // YOUR ORIGINAL STATE - COMPLETELY UNCHANGED
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  // YOUR ORIGINAL useEffect - COMPLETELY UNCHANGED
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()

      setSession(data.session)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // YOUR ORIGINAL loading check - STYLED only
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // YOUR ORIGINAL session check - COMPLETELY UNCHANGED
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // YOUR ORIGINAL return - COMPLETELY UNCHANGED
  return <Outlet />
}