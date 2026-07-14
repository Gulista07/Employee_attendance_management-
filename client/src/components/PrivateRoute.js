import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a page with <PrivateRoute roles={['admin']}> to require login
// (and optionally a specific role) before rendering it.
export default function PrivateRoute({ children, roles }) {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (roles && !roles.includes(user.role)) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}
