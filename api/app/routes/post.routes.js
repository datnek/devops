module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');

    // Create a new Post
    app.post('/api/posts', posts.create);

    // Retrieve all Posts
    app.get('/api/posts', posts.findAll);

    // Retrieve a single Note with postId
    app.get('/api/posts/:postId', posts.findOne);

    // Update a Note with postId
    app.post('/api/posts/update/:postId', posts.update);

    // Delete a Note with postId
    app.get('/api/posts/delete/:postId', posts.delete);
}
