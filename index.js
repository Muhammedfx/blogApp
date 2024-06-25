import express from "express";
import bodyParser from "body-parser";
import fs from 'fs';

const app = express();
const port = 3000;
app.use(express.static("public"));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));




// Sample array to store blog posts (in-memory storage)
let posts = [];
//let currentDate;


// load post from json file
const loadPosts = () => {
    try {
        const data = fs.readFileSync('./data/posts.json', 'utf-8');
        posts = JSON.parse(data);
    } catch (err) {
        console.error('Error reading posts.json:', err);
        posts = [];
    }
};

// Save posts to JSON file
const savePosts = () => {
    try {
        fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));
    } catch (err) {
        console.error('Error writing to posts.json:', err);
    }
};

loadPosts();


// Route to render home page the index.ejs file
app.get('/home', (req, res) => {
    res.render('index.ejs');
});

// for about page
app.get('/about', (req, res) => {
    res.render('about.ejs');
});

// for contact page
app.get('/contact', (req, res) => {
    res.render('contact.ejs');
});
// for create blog page
app.get('/create', (req, res) => {
    res.render('blog.ejs', { posts });
});
// to give your post back as the user
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: Date.now(), title, content };
    posts.push(newPost);
    savePosts();
    res.redirect('/create');
});
// to render edit page
app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.render('blogpost.ejs', { post });
    } else {
        res.status(404).send('Post not found');
    }
});
// to use the save changes button
app.post('/edit/:id', (req, res) => {
    const { title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id == req.params.id);
    if (postIndex !== -1) {
        posts[postIndex] = { id: posts[postIndex].id, title, content };
        savePosts();
        res.redirect('/create');
    } else {
        res.status(404).send('Post not found');
    }
});
 // make the delete buttons works

 app.post('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    savePosts();
    res.redirect('/create');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});