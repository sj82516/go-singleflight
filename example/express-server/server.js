const SingleFlight = require('go-singleflight').default;
const wait = require('wait')

const express = require('express');
const ioredis = require('ioredis');
const mysql = require('mysql2');

const app = express();
app.get('/test', async (req, res) => {
	const key = 'test';
	let value = await readFromCache(key);
	if (!value) {
		value = await readFromDb(key);
		await setCache(key, value);
	}
	
	// delete cache for next run
	delCache(key);
	return res.json({
		value
	});
});

// initial once and pass down by middleware
const singleFlight = new SingleFlight();
app.use((req, res, next) => {
	req.singleFlight = singleFlight
	next();
});
app.get('/test-singleflight', async (req, res) => {
	const key = 'test';
	let value = await readFromCache(key);
	if (!value) {
		try {
			const protectFn = req.singleFlight.do(key, readFromDb);
			value = await protectFn(key);
		}catch (e) {
			console.error(e)
		}
		await setCache(key, value);
	}
	
	// clear cache for next run test
	delCache(key);
	return res.json({
		value
	});
});

const redisClient = new ioredis();

async function readFromCache(key) {
	return redisClient.get(key);
}

async function setCache(key, value) {
	return redisClient.set(key, value);
}

async function delCache(key){
	return redisClient.del(key)
}

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'test'
});

async function readFromDb(key) {
	console.log('db got query');
	const [rows, fields] = await connection.promise().query('select * from test where `key`=?', [key]);
	await wait(1500);
	return rows[0];
}

app.listen(3001, () => {
	console.log(`listen at 3001`);
});