import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	if (!user) return null;

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav style={styles.nav}>
			<div style={styles.brand}>Attendance MS</div>
			<div style={styles.links}>
				<Link to="/dashboard" style={styles.link}>Dashboard</Link>
				<Link to="/attendance" style={styles.link}>Attendance</Link>
				{user.role === 'admin' && (
					<>
						<Link to="/departments" style={styles.link}>Departments</Link>
						<Link to="/employees" style={styles.link}>Employees</Link>
					</>
				)}
				<span style={styles.userInfo}>{user.name} ({user.role})</span>
				<button onClick={handleLogout} style={styles.button}>Logout</button>
			</div>
		</nav>
	);
}

const styles = {
	nav: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '12px 24px',
		background: '#1f2937',
		color: '#fff'
	},
	brand: { fontWeight: 'bold', fontSize: '18px' },
	links: { display: 'flex', alignItems: 'center', gap: '16px' },
	link: { color: '#fff', textDecoration: 'none' },
	userInfo: { color: '#9ca3af', fontSize: '14px' },
	button: {
		background: '#ef4444',
		color: '#fff',
		border: 'none',
		padding: '6px 12px',
		borderRadius: '4px',
		cursor: 'pointer'
	}
};
