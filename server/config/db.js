const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		dialect: 'mysql',
		logging: false
	}
);

const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('MySQL connected');
		// Creates/updates tables to match the models. Safe for dev;
		// for production use proper migrations instead of sync().
		await sequelize.sync({ alter: true });
		console.log('Models synced');
	} catch (err) {
		console.error(`MySQL connection error: ${err.message}`);
		process.exit(1);
	}
};

module.exports = { sequelize, connectDB };
