const { sequelize } = require('../config/db');
const User = require('./User');
const Department = require('./Department');
const Employee = require('./Employee');
const Attendance = require('./Attendance');

// Associations
Department.hasMany(Employee, { foreignKey: 'departmentId', onDelete: 'RESTRICT' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

Employee.hasMany(Attendance, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasOne(User, { foreignKey: 'employeeId' });
User.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = { sequelize, User, Department, Employee, Attendance };
