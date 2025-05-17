// import { Pool } from 'pg';
const { create } = require('domain');
const { Pool } = require('pg');




function createPool(dbDetails) {
	global.pool = new Pool({
		...dbDetails
	});
}

module.exports = createPool;
