import { Navigate, useLocation } from 'react-router-dom'
import { useUserAuth } from '@/components/store/authstore'

/**
 * User-only route guard.
 * Redirects unauthenticated visitors to /login, preserving the intended
 * destination in `state.returnTo` so LoginPage can send them back.
 */
export default function UserProtectedRoute({ children }) {
  const { isUser } = useUserAuth()
  const location = useLocation()

  if (!isUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: location.pathname + location.search }}
      />
    )
  }

  return children
}
