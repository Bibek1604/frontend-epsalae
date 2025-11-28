import { useAuthStore } from '../components/store/authstore';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
