import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { register, loading } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			await register(name, email, password);
			navigate('/dashboard');
		} catch (err) {
			setError(err.response?.data?.message || 'Registration failed');
		}
	};

	return (
		<div style={styles.container}>
			<form onSubmit={handleSubmit} style={styles.form}>
				<h2>Register</h2>
				{error && <p style={styles.error}>{error}</p>}
				<label>Name</label>
				<input value={name} onChange={(e) => setName(e.target.value)} required />
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<label>Password</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
				<button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
				<p>Already have an account? <Link to="/login">Login</Link></p>
			</form>
		</div>
	);
}

const styles = {
	container: { display: 'flex', justifyContent: 'center', marginTop: '60px' },
	form: { display: 'flex', flexDirection: 'column', width: '320px', gap: '8px' },
	error: { color: 'red' }
};
