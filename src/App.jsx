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
    
      <Route path="/login" element={<Login />} />
      <Route path="/survey/:token" element={<Survey />} />
      <Route path="/home" element={<ThankYou />} />

     
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/register" element={<RegisterGuest />} />
        <Route path="/admin/export" element={<Export />} />
      </Route>

    
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}

export default App