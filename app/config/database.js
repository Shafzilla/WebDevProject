require('dotenv').config();

const { Pool } = require('pg');
const { listRestaurants, listDishes } = require('./app/controller/api');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.on('connect', () => console.log('Connected to PostgreSQL'));

module.exports = pool;