const { Employee, Department } = require('../models');

// POST /api/employees
exports.createEmployee = async (req, res, next) => {
	try {
		const employee = await Employee.create(req.body);
		res.status(201).json(employee);
	} catch (err) {
		next(err);
	}
};

// GET /api/employees
exports.getEmployees = async (req, res, next) => {
	try {
		const { department, status } = req.query;
		const where = {};
		if (department) where.departmentId = department;
		if (status) where.status = status;

		const employees = await Employee.findAll({
			where,
			include: [{ model: Department, attributes: ['id', 'name'] }],
			order: [['name', 'ASC']]
		});
		res.json(employees);
	} catch (err) {
		next(err);
	}
};

// GET /api/employees/:id
exports.getEmployee = async (req, res, next) => {
	try {
		const employee = await Employee.findByPk(req.params.id, {
			include: [{ model: Department, attributes: ['id', 'name'] }]
		});
		if (!employee) return res.status(404).json({ message: 'Employee not found' });
		res.json(employee);
	} catch (err) {
		next(err);
	}
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res, next) => {
	try {
		const employee = await Employee.findByPk(req.params.id);
		if (!employee) return res.status(404).json({ message: 'Employee not found' });
		await employee.update(req.body);
		const updated = await Employee.findByPk(employee.id, {
			include: [{ model: Department, attributes: ['id', 'name'] }]
		});
		res.json(updated);
	} catch (err) {
		next(err);
	}
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res, next) => {
	try {
		const employee = await Employee.findByPk(req.params.id);
		if (!employee) return res.status(404).json({ message: 'Employee not found' });
		await employee.destroy();
		res.json({ message: 'Employee deleted' });
	} catch (err) {
		next(err);
	}
};
