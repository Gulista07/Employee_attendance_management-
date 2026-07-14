const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verifies the JWT sent in the Authorization header and attaches req.user
const protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return res.status(401).json({ message: 'Not authorized, no token' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findByPk(decoded.id, {
			attributes: { exclude: ['password'] }
		});
		if (!req.user) {
			return res.status(401).json({ message: 'Not authorized, user not found' });
		}
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Not authorized, token invalid' });
	}
};

// Restrict a route to specific roles, e.g. authorize('admin')
const authorize = (...roles) => (req, res, next) => {
	if (!req.user || !roles.includes(req.user.role)) {
		return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
	}
	next();
};

module.exports = { protect, authorize };
