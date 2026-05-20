import { useAdminAuth } from '../components/store/authstore';
import { Navigate } from 'react-router-dom';

/**
 * Admin-only route guard. Reads the dedicated admin auth slice so a
 * regular-user session cannot grant access to /admin pages.
 */
export default function ProtectedRoute({ children }) {
  const { isAdmin } = useAdminAuth();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
