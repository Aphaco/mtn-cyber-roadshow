import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Dashboard from './pages/admin/dashboard'
import RegisterGuest from './pages/admin/RegisterGuest'
import Survey from './pages/survey/survey'
import Export from './pages/admin/Export'
import ThankYou from './pages/survey/ThankYou'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
    
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/survey/:token" element={<Survey />} />
      
      {/* ✅ ADD THIS LINE - Thank You Route */}
      <Route path="/thank-you" element={<ThankYou />} />

      {/* Root redirects to login for admins */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Admin Area */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/register" element={<RegisterGuest />} />
        <Route path="/admin/export" element={<Export />} />
      </Route>

      {/* ❌ This only catches routes that don't match anything above */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}

export default App