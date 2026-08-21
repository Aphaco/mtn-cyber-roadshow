import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Dashboard from './pages/admin/dashboard'
import RegisterGuest from './pages/admin/RegisterGuest'
import Survey from './pages/survey/Survey'  // ADDED THIS LINE
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* ADDED: Survey Route - Public */}
      <Route
        path="/survey/:token"
        element={<Survey />}
      />

      {/* Protected Admin Area */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/admin"
          element={<Dashboard />}
        />

        <Route
          path="/admin/register"
          element={<RegisterGuest />}
        />

      </Route>

      {/* Default */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  )
}

export default App