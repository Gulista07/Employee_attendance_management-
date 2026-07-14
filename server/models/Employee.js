const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Employee = sequelize.define(
	'Employee',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
		phone: { type: DataTypes.STRING },
		designation: { type: DataTypes.STRING },
		dateOfJoining: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
		salary: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
		status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }
	},
	{ tableName: 'employees' }
);

module.exports = Employee;
