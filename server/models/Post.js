const db = require('../config/db');

const Post = {
    async create(title, body) {
        const result = await db.pool.query('INSERT INTO posts (title, body) VALUES ($1, $2) RETURNING *', [title, body]);
        return result.rows[0];
    },

    async findAll() {
        const result = await db.pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        return result.rows;
    },

    async findById(id) {
        const result = await db.pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        return result.rows[0];
    },

    async update(id, title, body) {
        await db.pool.query('UPDATE posts SET title = $1, body = $2, updated_at = $3, WHERE id = $4', [title, body, NOW(), id]);
    },

    async delete(id) {
        await db.pool.query('DELETE FROM posts WHERE id = $1', [id]);
    }
}

module.exports = Post;

/* const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema); */