const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        return result.rows[0];
    },

    async findOne(username) {
        const result = await db.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }
};

module.exports = User;

/* const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema); */