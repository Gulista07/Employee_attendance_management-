import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { login, loading } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			await login(email, password);
			navigate('/dashboard');
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed');
		}
	};

	return (
		<div style={styles.container}>
			<form onSubmit={handleSubmit} style={styles.form}>
				<h2>Login</h2>
				{error && <p style={styles.error}>{error}</p>}
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<label>Password</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
				<p>No account? <Link to="/register">Register</Link></p>
			</form>
		</div>
	);
}

const styles = {
	container: { display: 'flex', justifyContent: 'center', marginTop: '60px' },
	form: { display: 'flex', flexDirection: 'column', width: '320px', gap: '8px' },
	error: { color: 'red' }
};
