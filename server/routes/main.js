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
        description: "Something about Tarre."
    }
    res.render('about', {
        locals,
        currentRoute: '/about'
    });
});

router.get('/contact', (req, res) => {
    const locals = {
        title: "Tarre Blog - Contact",
        description: "Contact Tarre"
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
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
        });

        res.render("search", {
            data,
            locals
        });
        
    } catch (error) {
        console.log(error);
    }
}); 

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
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