const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schema and model for posts
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Post = mongoose.model('Post', postSchema);

// Set EJS as view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // For static files (CSS, images)

// Routes
app.get('/', (req, res) => {
    Post.find({})
        .then(posts => {
            res.render('home', { posts: posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error fetching posts');
        });
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', (req, res) => {
    const newPost = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    newPost.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error saving post');
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
