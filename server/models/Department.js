const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Equivalent of the "District" module from the original report —
// a simple reference/lookup entity with full CRUD.
const Department = sequelize.define(
	'Department',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING, allowNull: false, unique: true },
		description: { type: DataTypes.STRING, defaultValue: '' }
	},
	{ tableName: 'departments' }
);

module.exports = Department;
