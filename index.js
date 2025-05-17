const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

for (let e of process.argv) {
	if (e.toLocaleLowerCase().startsWith('--env')) {
		let environment = e.split(':');
		if (environment.length > 0) { process.env['NODE_ENV'] = environment[1].toUpperCase(); }
	} else if (e.toLocaleLowerCase().startsWith('--migrate')) {
		migrate = e.toLocaleLowerCase();
	}
}

let configObject = require('./config/Config.js');

require('./DBConnection.js')(configObject.dbDetails);

app.post('/app/login', async (req, res) => {
	const { email, password } = req.body;

	const client = await pool.connect();
	try {
		const result = await client.query('SELECT * FROM public.users WHERE email = $1 AND password = $2', [email, password]);
		if (result.rows.length > 0) {
			const user = result.rows[0];
			console.log('User found:', user);
		} else {
			console.log('User not found');
		}
	} catch (err) {
		console.error('Error executing query', err.stack);

	} finally {
		client.release();
	}

	const accessToken = jwt.sign({ email, password }, process.env.ACCESS_TOKEN_SECRET);
	res.cookie('jwt', accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: configObject.maxAge// 1 day
	});
	res.sendStatus(200);
})

app.post('/app/logout', (req, res) => {
	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'strict',
		secure: true
	});
	res.sendStatus(200);
});

function authenticateToken(req, res, next) {
	const token = req.cookies.jwt;
	console.log('tokenValue:: ', token);
	if (!token) return res.sendStatus(401);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403);
		req.user = decoded;
		decoded.password = 'abc';
		next();
	})
	console.log('req.user:: ', req.user);
}

app.use(authenticateToken);

app.post('/app/verifyAuth', (req, res) => {
	console.log('hitting verifyAuth');
	res.sendStatus(200);
})

app.post('/', (req, res) => {
	res.sendStatus(404).send('Default POST route');
});

app.listen(configObject.port, () => {
	console.log(`Listening on port ${configObject.port}`);
})