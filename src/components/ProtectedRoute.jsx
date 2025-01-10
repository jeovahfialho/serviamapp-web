import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const token = useAuth(state => state.token);
    console.log('ProtectedRoute - token:', token);
    console.log('ProtectedRoute - full state:', useAuth.getState());
  
    if (!token) {
      console.log('No token, redirecting to login');
      return <Navigate to="/login" />;
    }
  
    return children;
  };

export default ProtectedRoute;