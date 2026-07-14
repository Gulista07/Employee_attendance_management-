import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function Shell() {
	const { user } = useAuth();
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
				<Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path="/departments"
					element={
						<PrivateRoute roles={['admin']}>
							<Departments />
						</PrivateRoute>
					}
				/>
				<Route
					path="/employees"
					element={
						<PrivateRoute roles={['admin']}>
							<Employees />
						</PrivateRoute>
					}
				/>
				<Route
					path="/attendance"
					element={
						<PrivateRoute>
							<Attendance />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
			</Routes>
		</BrowserRouter>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<Shell />
		</AuthProvider>
	);
}
