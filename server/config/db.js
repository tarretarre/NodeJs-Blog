const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL Db Connected');
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    connectDB,
    pool
};