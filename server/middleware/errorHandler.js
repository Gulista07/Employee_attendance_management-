// Centralized error handler — controllers can just throw or call next(err)
const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	if (err.name === 'SequelizeUniqueConstraintError') {
		const field = err.errors?.[0]?.path || 'field';
		return res.status(409).json({ message: `Duplicate value for field: ${field}` });
	}

	if (err.name === 'SequelizeValidationError') {
		const messages = err.errors.map((e) => e.message);
		return res.status(400).json({ message: messages.join(', ') });
	}

	if (err.name === 'SequelizeForeignKeyConstraintError') {
		return res.status(400).json({ message: 'Invalid reference: related record does not exist' });
	}

	if (err.name === 'SequelizeDatabaseError') {
		return res.status(400).json({ message: 'Invalid request data' });
	}

	res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
};

const notFound = (req, res) => {
	res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
