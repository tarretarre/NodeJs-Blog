const express = require('express');
const router = express.Router();
const {pool} = require('../config/db');
const bcrypt = require('bcryptjs');
//const Post = require('../models/Post');

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Tarre Blog - Home",
            description: "Simple Blog created with NodeJs, Express & PostgreSQL."
        }

        let perPage = 3;
        let page = req.query.page || 1;

        const offset = (page - 1) * perPage;

        const {rows} = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2', [perPage, offset]);
/*        const data = await Post.aggregate([{$sort: { createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); */

        const countResult = await pool.query('SELECT COUNT(*) FROM posts');
        const count = parseInt(countResult.rows[0].count);
//        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', { 
            locals, 
            data: rows,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
    
});

router.get('/about', (req, res) => {
    const locals = {
        title: "Tarre Blog - About",
        description: "Something about Tarre.",
        linkedinUrl: process.env.LINKEDIN_URL,
        githubUrl: process.env.GITHUB_URL
    }
    res.render('about', {
        locals,
        currentRoute: '/about'
    });
});

router.get('/contact', (req, res) => {
    const locals = {
        title: "Tarre Blog - Contact",
        description: "Ways to contact Tarre"
    }
    res.render('contact', {
        locals,
        currentRoute: '/contact'
    });
});

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & PostgreSQL."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const {rows} = await pool.query(
            'SELECT * FROM posts WHERE title ILIKE $1 OR body ILIKE $1',
            [`%${searchNoSpecialChar}%`]
        );
/*        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
        }); */

        res.render("search", {
            data: rows,
            locals
        });
        
    } catch (error) {
        console.log(error);
    }
}); 

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const {rows} = await pool.query('SELECT * FROM posts WHERE id = $1', [slug]);
        const data = rows[0];
//        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & PostgreSQL.",
        }

        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }
}); 

module.exports = router;

/*router.post('/register', async(req, res) => {
    const {username, password} = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (existingUser.rowCount.length > 0) {
            return res.status(400).send('Username already registered.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong when register.');
    }
});*/

/* async function insertPostData() {
    const posts = [
        {
            title: "Building a blog",
            body: "This is my first blog from NodeJs, Express and PostgreSQL."
        }
    ];

    try {
        for (const post of posts) {
            await pool.query(
                'INSERT INTO posts (title, body, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
                [post.title, post.body]
            );
        }
        console.log("Posts inserted successfully.");
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await insertPostData();
})(); */

/*function insertPostData() {
    Post.insertMany([
        {
            title: "Building a Blog",
            body: "This is my first blog from NodeJs, Express and MongoDB."
        },
        {
            title: "Webbapplikation in the making",
            body: "The blog is finally up."
        },
        {
            title: "Connecting to MongoDB",
            body: "The database is connected with my blog."
        },
    ])
}
insertPostData();*/

/*router.get('', async (req, res) => {
    const locals = {
            title: "Tarre Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    try {
        const data = await Post.find();
        res.render('index', {locals, data});
    } catch (error) {
        console.log(error);
    }
}); */