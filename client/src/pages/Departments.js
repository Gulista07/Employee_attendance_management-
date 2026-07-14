import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Departments() {
	const [departments, setDepartments] = useState([]);
	const [form, setForm] = useState({ name: '', description: '' });
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState('');

	const load = async () => {
		const { data } = await api.get('/departments');
		setDepartments(data);
	};

	useEffect(() => {
		load();
	}, []);

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const resetForm = () => {
		setForm({ name: '', description: '' });
		setEditingId(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			if (editingId) {
				await api.put(`/departments/${editingId}`, form);
			} else {
				await api.post('/departments', form);
			}
			resetForm();
			load();
		} catch (err) {
			setError(err.response?.data?.message || 'Save failed');
		}
	};

	const handleEdit = (dept) => {
		setForm({ name: dept.name, description: dept.description });
		setEditingId(dept._id);
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this department?')) return;
		await api.delete(`/departments/${id}`);
		load();
	};

	return (
		<div style={{ padding: '24px' }}>
			<h2>Departments</h2>

			<form onSubmit={handleSubmit} style={styles.form}>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<input
					name="name"
					placeholder="Department name"
					value={form.name}
					onChange={handleChange}
					required
				/>
				<input
					name="description"
					placeholder="Description"
					value={form.description}
					onChange={handleChange}
				/>
				<button type="submit">{editingId ? 'Update' : 'Add'}</button>
				{editingId && <button type="button" onClick={resetForm}>Cancel</button>}
			</form>

			<table style={styles.table}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{departments.map((d) => (
						<tr key={d._id}>
							<td>{d.name}</td>
							<td>{d.description}</td>
							<td>
								<button onClick={() => handleEdit(d)}>Edit</button>{' '}
								<button onClick={() => handleDelete(d._id)}>Delete</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const styles = {
	form: { display: 'flex', gap: '8px', marginBottom: '16px' },
	table: { width: '100%', borderCollapse: 'collapse' }
};
