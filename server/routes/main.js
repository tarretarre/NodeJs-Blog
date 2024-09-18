const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Tarre Blog - Home",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 3;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort: { createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }
    
});

router.get('/about', (req, res) => {
    const locals = {
        title: "Tarre Blog - About",
        description: "Something about Tarre."
    }
    res.render('about', { locals });
});

router.get('/contact', (req, res) => {
    const locals = {
        title: "Tarre Blog - Contact",
        description: "Contact Tarre"
    }
    res.render('contact', { locals });
});

module.exports = router;

/* router.get('', async (req, res) => {
    const locals = {
        title: "Tarre Blog - Home",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    try {
        const data = await Post.find();
        res.render('index', { locals, data });
    } catch (error) {
        console.log(error);
    }
    
}); */

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