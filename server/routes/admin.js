const express = require('express');
const router = express.Router();
const {pool} = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message: 'Unauthorized.'});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error) {
        res.status(401).json({message: 'Unauthorized.'});
    }
}

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & PostgreSQL."
    }

    res.render('admin/index', {
        locals, 
        layout: adminLayout
    });
    } catch (error) {
        console.log(error);
    }
});

router.post('/admin', async (req, res) => {
    try {
        const {username, password} = req.body;
        const {rows} = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if(rows.length === 0){
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});

router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const {rows} = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
            res.status(201).json({message: 'User Created', user: rows[0]});
        } catch (error) {
            if(error.code === 23505) {
                res.status(409).json({message: 'User already in use.'});
            }
            res.status(500).json({message: 'Internal server error.'})
        }
        
    } catch (error) {
        console.log(error);
    }
});

router.get('/dashboard', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & PostgreSQL'
        }

        const {rows} = await pool.query('SELECT * FROM posts');
        res.render('admin/dashboard', {
            locals,
            data: rows,
            layout: adminLayout
        });
        
    } catch (error) {
        console.log(error);
    }
});

router.get('/add-post', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog created with NodeJs, Express & PostgreSQL'
        }

        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });
        
    } catch (error) {
        console.log(error);
    }
});

router.post('/add-post', authMiddleware, async (req, res) => {

    try {
        const {title, body} = req.body;

        await pool.query('INSERT INTO posts (title, body, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())', [title, body]);
        res.redirect('/dashboard');
        
    } catch (error) {
        console.log(error);
    }
});

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: 'Edit Post',
            description: 'Simple Blog created with NodeJs, Express & PostgreSQL'
        }

        const {rows} = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
        const data = rows[0];

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }
});

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
            await pool.query('UPDATE posts SET title = $1, body = $2, updated_at = NOW() WHERE id = $3', [
                req.body.title,
                req.body.body,
                req.params.id
            ]);

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;