import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const today = () => new Date().toISOString().slice(0, 10);

export default function Attendance() {
	const { user } = useAuth();
	const [employees, setEmployees] = useState([]);
	const [markForm, setMarkForm] = useState({ employeeId: '', date: today(), status: 'Present' });
	const [historyEmployeeId, setHistoryEmployeeId] = useState('');
	const [history, setHistory] = useState([]);
	const [byDate, setByDate] = useState([]);
	const [dateFilter, setDateFilter] = useState(today());
	const [message, setMessage] = useState('');

	useEffect(() => {
		api.get('/employees').then((res) => setEmployees(res.data));
	}, []);

	const handleMarkChange = (e) => setMarkForm({ ...markForm, [e.target.name]: e.target.value });

	const handleMark = async (e) => {
		e.preventDefault();
		setMessage('');
		try {
			await api.post('/attendance/mark', markForm);
			setMessage('Attendance saved.');
		} catch (err) {
			setMessage(err.response?.data?.message || 'Failed to save attendance');
		}
	};

	const loadHistory = async () => {
		if (!historyEmployeeId) return;
		const { data } = await api.get(`/attendance/employee/${historyEmployeeId}`);
		setHistory(data);
	};

	const loadByDate = async () => {
		const { data } = await api.get('/attendance', { params: { date: dateFilter } });
		setByDate(data);
	};

	return (
		<div style={{ padding: '24px' }}>
			<h2>Mark Attendance</h2>
			<form onSubmit={handleMark} style={styles.form}>
				{message && <p>{message}</p>}
				<select name="employeeId" value={markForm.employeeId} onChange={handleMarkChange} required>
					<option value="">Select employee</option>
					{employees.map((e) => (
						<option key={e._id} value={e._id}>{e.name}</option>
					))}
				</select>
				<input type="date" name="date" value={markForm.date} onChange={handleMarkChange} required />
				<select name="status" value={markForm.status} onChange={handleMarkChange}>
					<option>Present</option>
					<option>Absent</option>
					<option>Leave</option>
					<option>Half Day</option>
				</select>
				<button type="submit">Save</button>
			</form>

			<h2>View Employee History</h2>
			<div style={styles.form}>
				<select value={historyEmployeeId} onChange={(e) => setHistoryEmployeeId(e.target.value)}>
					<option value="">Select employee</option>
					{employees.map((e) => (
						<option key={e._id} value={e._id}>{e.name}</option>
					))}
				</select>
				<button onClick={loadHistory}>Load</button>
			</div>
			<table style={styles.table}>
				<thead>
					<tr><th>Date</th><th>Status</th><th>Remarks</th></tr>
				</thead>
				<tbody>
					{history.map((r) => (
						<tr key={r._id}>
							<td>{new Date(r.date).toLocaleDateString()}</td>
							<td>{r.status}</td>
							<td>{r.remarks}</td>
						</tr>
					))}
				</tbody>
			</table>

			{user.role === 'admin' && (
				<>
					<h2>All Employees — Attendance by Date</h2>
					<div style={styles.form}>
						<input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
						<button onClick={loadByDate}>Load</button>
					</div>
					<table style={styles.table}>
						<thead>
							<tr><th>Employee</th><th>Status</th><th>Remarks</th></tr>
						</thead>
						<tbody>
							{byDate.map((r) => (
								<tr key={r._id}>
									<td>{r.employee?.name}</td>
									<td>{r.status}</td>
									<td>{r.remarks}</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			)}
		</div>
	);
}

const styles = {
	form: { display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' },
	table: { width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }
};
