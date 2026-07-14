const { Op } = require('sequelize');
const { Attendance, Employee } = require('../models');

const toDateOnly = (d) => new Date(d).toISOString().slice(0, 10);

// POST /api/attendance/mark
// Employee marks their own attendance for today (or a given date for admins)
exports.markAttendance = async (req, res, next) => {
	try {
		const { employeeId, date, status, checkIn, checkOut, remarks } = req.body;

		if (!employeeId) {
			return res.status(400).json({ message: 'employeeId is required' });
		}

		const employee = await Employee.findByPk(employeeId);
		if (!employee) return res.status(404).json({ message: 'Employee not found' });

		const day = toDateOnly(date || Date.now());

		let record = await Attendance.findOne({ where: { employeeId, date: day } });

		if (record) {
			await record.update({ status: status || 'Present', checkIn, checkOut, remarks });
		} else {
			record = await Attendance.create({
				employeeId,
				date: day,
				status: status || 'Present',
				checkIn,
				checkOut,
				remarks
			});
		}

		res.status(200).json(record);
	} catch (err) {
		next(err);
	}
};

// GET /api/attendance/employee/:employeeId?from=&to=
exports.getEmployeeAttendance = async (req, res, next) => {
	try {
		const { employeeId } = req.params;
		const { from, to } = req.query;

		const where = { employeeId };
		if (from || to) {
			where.date = {};
			if (from) where.date[Op.gte] = toDateOnly(from);
			if (to) where.date[Op.lte] = toDateOnly(to);
		}

		const records = await Attendance.findAll({ where, order: [['date', 'DESC']] });
		res.json(records);
	} catch (err) {
		next(err);
	}
};

// GET /api/attendance?date=YYYY-MM-DD  (admin view — everyone's attendance for a day)
exports.getAttendanceByDate = async (req, res, next) => {
	try {
		const date = toDateOnly(req.query.date || Date.now());
		const records = await Attendance.findAll({
			where: { date },
			include: [{ model: Employee, attributes: ['id', 'name', 'email', 'departmentId'] }]
		});
		res.json(records);
	} catch (err) {
		next(err);
	}
};

// GET /api/attendance/report/:employeeId?month=MM&year=YYYY
exports.getMonthlyReport = async (req, res, next) => {
	try {
		const { employeeId } = req.params;
		const now = new Date();
		const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
		const year = parseInt(req.query.year, 10) || now.getFullYear();

		const from = new Date(year, month - 1, 1).toISOString().slice(0, 10);
		const to = new Date(year, month, 0).toISOString().slice(0, 10);

		const records = await Attendance.findAll({
			where: { employeeId, date: { [Op.gte]: from, [Op.lte]: to } }
		});

		const summary = records.reduce(
			(acc, r) => {
				acc[r.status] = (acc[r.status] || 0) + 1;
				return acc;
			},
			{ Present: 0, Absent: 0, Leave: 0, 'Half Day': 0 }
		);

		res.json({ month, year, totalDays: records.length, summary, records });
	} catch (err) {
		next(err);
	}
};
