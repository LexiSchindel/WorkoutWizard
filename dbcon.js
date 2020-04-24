const mysql = require('mysql');
const env = require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: env.parsed.CLEARDB_DATABASE_HOST,
    user: env.parsed.CLEARDB_DATABASE_USER,
    password: env.parsed.CLEARDB_DATABASE_PW,
    database: env.parsed.CLEARDB_DATABASE_NAME,
    port: 3306
});

module.exports.pool = pool;