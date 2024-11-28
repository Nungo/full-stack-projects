import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/auth.service';

const ProtectedRoute = ({ children, roles = [] }) => {
    const user = AuthService.getCurrentUser();
    const location = useLocation();

    if (!user) {
        // Not logged in, redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles.length && !roles.includes(user.role)) {
        // Role not authorized, redirect to home page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;