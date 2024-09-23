const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_URL,
    ssl: {
        rejectUnauthorized: false
    }
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