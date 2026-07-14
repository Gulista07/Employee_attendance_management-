const express = require('express');
const {
	createDepartment,
	getDepartments,
	getDepartment,
	updateDepartment,
	deleteDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartment);
router.post('/', protect, authorize('admin'), createDepartment);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

module.exports = router;
