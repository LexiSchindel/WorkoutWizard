const mysql = require('mysql');
const env = require('dotenv').config();

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.CLEARDB_DATABASE_HOST || env.parsed.CLEARDB_DATABASE_HOST,
    user: process.env.CLEARDB_DATABASE_USER || env.parsed.CLEARDB_DATABASE_USER,
    password: process.env.CLEARDB_DATABASE_PW || env.parsed.CLEARDB_DATABASE_PW,
    database: process.env.CLEARDB_DATABASE_NAME || env.parsed.CLEARDB_DATABASE_NAME,
    port: 3306
});

module.exports.pool = pool;