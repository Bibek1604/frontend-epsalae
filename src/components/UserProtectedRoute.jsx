import { Navigate, useLocation } from 'react-router-dom'
import { useUserAuth } from '@/components/store/authstore'

/**
 * User-only route guard. Reads the dedicated user auth slice so an admin
 * session does NOT grant access to /account pages (they hit different APIs
 * with different tokens).
 */
export default function UserProtectedRoute({ children }) {
  const { isUser } = useUserAuth()
  const location = useLocation()

  if (!isUser) {
    return <Navigate to="/checkout" replace state={{ openAuth: true, returnTo: location.pathname + location.search }} />
  }

  return children
}
