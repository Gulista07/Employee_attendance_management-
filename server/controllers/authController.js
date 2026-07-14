const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d'
	});

// POST /api/auth/register
exports.register = async (req, res, next) => {
	try {
		const { name, email, password, role } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: 'name, email and password are required' });
		}

		const existing = await User.findOne({ where: { email } });
		if (existing) {
			return res.status(409).json({ message: 'Email already registered' });
		}

		const user = await User.create({
			name,
			email,
			password,
			role: role === 'admin' ? 'admin' : 'employee' // don't let clients self-promote by accident
		});

		const token = signToken(user.id);
		res.status(201).json({
			token,
			user: { id: user.id, name: user.name, email: user.email, role: user.role }
		});
	} catch (err) {
		next(err);
	}
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'email and password are required' });
		}

		const user = await User.findOne({ where: { email } });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		const token = signToken(user.id);
		res.json({
			token,
			user: { id: user.id, name: user.name, email: user.email, role: user.role }
		});
	} catch (err) {
		next(err);
	}
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
	try {
		res.json({ user: req.user });
	} catch (err) {
		next(err);
	}
};
