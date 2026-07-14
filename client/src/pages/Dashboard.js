import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<div style={{ padding: '24px' }}>
			<h2>Welcome, {user.name}</h2>
			<p>Role: {user.role}</p>
			{user.role === 'admin' ? (
				<p>Use the navigation above to manage Departments, Employees, and view Attendance records.</p>
			) : (
				<p>Use the navigation above to mark your daily attendance and view your history.</p>
			)}
		</div>
	);
}
