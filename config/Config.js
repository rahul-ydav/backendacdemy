const envFile = process.env.NODE_ENV || 'dev';
const fs = require('fs');


function setEnv(env) {
	console.log('setEnv to ', env)
	let path = ''

	if (fs.existsSync(`config/env/${env.toLowerCase()}.env`)) {
		path = `config/env/${env.toLowerCase()}.env`
	}
	else {
		console.log(`unable to find environment file`)
	}

	if (path) console.log(`using env file from ${path}`)

	require('dotenv').config({ path: path, override: true })

}

setEnv(envFile);

function setConfigs() {
	console.log('setting up values');
	return {
		port: process.env.port || 8000,
		maxAge: process.env.maxAge || 100000,
		dbDetails: {
			host: process.env.dbHost || 'localhost',
			port: process.env.dbPort || 5442,
			database: process.env.dbName || 'postgres',
			user: process.env.dbUser || 'postgres',
			password: process.env.dbPassword || 'postgres',
			max: 10, // Maximum number of clients in the pool
			idleTimeoutMillis: 120000 // Close idle clients after 2 minutes
		}
	}
}

module.exports = setConfigs();
