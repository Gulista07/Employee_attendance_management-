const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define(
	'Attendance',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		date: { type: DataTypes.DATEONLY, allowNull: false },
		status: {
			type: DataTypes.ENUM('Present', 'Absent', 'Leave', 'Half Day'),
			defaultValue: 'Present'
		},
		checkIn: { type: DataTypes.STRING },
		checkOut: { type: DataTypes.STRING },
		remarks: { type: DataTypes.STRING, defaultValue: '' }
	},
	{
		tableName: 'attendance',
		indexes: [{ unique: true, fields: ['employeeId', 'date'] }]
	}
);

module.exports = Attendance;
