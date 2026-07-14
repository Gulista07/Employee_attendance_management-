const express = require('express');
const {
	markAttendance,
	getEmployeeAttendance,
	getAttendanceByDate,
	getMonthlyReport
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/mark', protect, markAttendance);
router.get('/employee/:employeeId', protect, getEmployeeAttendance);
router.get('/report/:employeeId', protect, getMonthlyReport);
router.get('/', protect, authorize('admin'), getAttendanceByDate);

module.exports = router;
