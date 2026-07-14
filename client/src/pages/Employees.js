import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
	name: '',
	email: '',
	phone: '',
	designation: '',
	department: '',
	salary: ''
};

export default function Employees() {
	const [employees, setEmployees] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [form, setForm] = useState(emptyForm);
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState('');

	const load = async () => {
		const [empRes, deptRes] = await Promise.all([api.get('/employees'), api.get('/departments')]);
		setEmployees(empRes.data);
		setDepartments(deptRes.data);
	};

	useEffect(() => {
		load();
	}, []);

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const resetForm = () => {
		setForm(emptyForm);
		setEditingId(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			if (editingId) {
				await api.put(`/employees/${editingId}`, form);
			} else {
				await api.post('/employees', form);
			}
			resetForm();
			load();
		} catch (err) {
			setError(err.response?.data?.message || 'Save failed');
		}
	};

	const handleEdit = (emp) => {
		setForm({
			name: emp.name,
			email: emp.email,
			phone: emp.phone || '',
			designation: emp.designation || '',
			department: emp.department?._id || '',
			salary: emp.salary || ''
		});
		setEditingId(emp._id);
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this employee?')) return;
		await api.delete(`/employees/${id}`);
		load();
	};

	return (
		<div style={{ padding: '24px' }}>
			<h2>Employees</h2>

			<form onSubmit={handleSubmit} style={styles.form}>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
				<input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
				<input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
				<input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} />
				<select name="department" value={form.department} onChange={handleChange} required>
					<option value="">Select department</option>
					{departments.map((d) => (
						<option key={d._id} value={d._id}>{d.name}</option>
					))}
				</select>
				<input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
				<button type="submit">{editingId ? 'Update' : 'Add'}</button>
				{editingId && <button type="button" onClick={resetForm}>Cancel</button>}
			</form>

			<table style={styles.table}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Department</th>
						<th>Designation</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{employees.map((e) => (
						<tr key={e._id}>
							<td>{e.name}</td>
							<td>{e.email}</td>
							<td>{e.department?.name}</td>
							<td>{e.designation}</td>
							<td>{e.status}</td>
							<td>
								<button onClick={() => handleEdit(e)}>Edit</button>{' '}
								<button onClick={() => handleDelete(e._id)}>Delete</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const styles = {
	form: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
	table: { width: '100%', borderCollapse: 'collapse' }
};
