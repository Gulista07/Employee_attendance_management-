const { Department } = require('../models');

// POST /api/departments
exports.createDepartment = async (req, res, next) => {
	try {
		const { name, description } = req.body;
		const dept = await Department.create({ name, description });
		res.status(201).json(dept);
	} catch (err) {
		next(err);
	}
};

// GET /api/departments
exports.getDepartments = async (req, res, next) => {
	try {
		const departments = await Department.findAll({ order: [['name', 'ASC']] });
		res.json(departments);
	} catch (err) {
		next(err);
	}
};

// GET /api/departments/:id
exports.getDepartment = async (req, res, next) => {
	try {
		const dept = await Department.findByPk(req.params.id);
		if (!dept) return res.status(404).json({ message: 'Department not found' });
		res.json(dept);
	} catch (err) {
		next(err);
	}
};

// PUT /api/departments/:id
exports.updateDepartment = async (req, res, next) => {
	try {
		const dept = await Department.findByPk(req.params.id);
		if (!dept) return res.status(404).json({ message: 'Department not found' });
		await dept.update(req.body);
		res.json(dept);
	} catch (err) {
		next(err);
	}
};

// DELETE /api/departments/:id
exports.deleteDepartment = async (req, res, next) => {
	try {
		const dept = await Department.findByPk(req.params.id);
		if (!dept) return res.status(404).json({ message: 'Department not found' });
		await dept.destroy();
		res.json({ message: 'Department deleted' });
	} catch (err) {
		next(err);
	}
};
