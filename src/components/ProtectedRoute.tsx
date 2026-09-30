import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// En esta fase basta con que exista un token; no se valida criptográficamente.
function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
