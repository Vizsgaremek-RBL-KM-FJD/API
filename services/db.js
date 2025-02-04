const mysql = require('mysql2/promise');
const { config } = require('../config/config');

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function query(sql, params) {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(sql, params);
        return result;
    } catch (error) {
        console.error(' Database query error:', error);
        throw error;
    } finally {
        connection.release(); 
    }
}

module.exports = { query };
