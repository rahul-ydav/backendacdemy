const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AuthService = require('./AuthWork/services/AuthService.js');
const { authenticateToken } = new AuthService();

const authRoutes = require('./AuthWork/controllers/AuthRoutes.js');
const Lessons = require('./Lessons/controllers/lessons.get.js');
const Progress = require('./Progress/controllers/progress.get.js');
const LessonsPut = require('./Lessons/controllers/lessons.put.js');

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

app.use('/app', authRoutes);

app.use(authenticateToken);

app.post('/app/verifyAuth', (req, res) => {
	res.sendStatus(200);
})

app.use('/app', Lessons);
app.use('/app', LessonsPut);
app.use('/app', Progress);


app.get('/', (req, res) => {
	res.send('Default GET route');
});


app.post('/', (req, res) => {
	res.sendStatus(404).send('Default POST route');
});

app.listen(configObject.port, () => {
	console.log(`Listening on port ${configObject.port}`);
})