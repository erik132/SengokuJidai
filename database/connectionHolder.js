const mysql = require('mysql2');

var credentials = require("./connectDetails.js");


const pool = mysql.createPool({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = pool;