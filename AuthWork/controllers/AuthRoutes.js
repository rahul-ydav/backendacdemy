const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const AuthService = new (require('../services/AuthService.js'))();

app.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}
		const client = await pool.connect();
		const result = await client.query('SELECT * FROM public.users WHERE email = $1 AND password = $2', [email, password]);
		client.release();
		if (result.rows.length > 0) {
			// const user = result.rows[0];
			const accessToken = jwt.sign({ email, password }, process.env.ACCESS_TOKEN_SECRET);
			res.cookie('jwt', accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: process.env.maxAge
			});
			return res.status(200).json({ message: 'Login successful' });
		} else {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error', error });
	}
})

app.post('/logout', (req, res) => {
	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'strict',
		secure: true
	});
	res.sendStatus(200);
});


module.exports = app;