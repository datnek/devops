const post = require('../models/post.model.js');

// Create and Save a new post
exports.create = (req, res) => {
    // Validate request
    if(!req.body.description) {
        return res.status(400).send({
            message: "post description can not be empty"
        });
    }

    // Validate request
    if(!req.body.title) {
        return res.status(400).send({
            message: "post title can not be empty"
        });
    }

    // Create a post
    const Post = new post({
        title: req.body.title ,
        description: req.body.description
    });

    // Save post in the database
    Post.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the post."
        });
    });
};

// Retrieve and return all posts from the database.
exports.findAll = (req, res) => {
    post.find()
        .then(posts => {
            res.send(posts);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving posts."
        });
    });
};

// Find a single post with a postId
exports.findOne = (req, res) => {
    post.findById(req.params.postId)
        .then(post => {
            if(!post) {
                return res.status(400).send({
                    message: "post not found with id " + req.params.postId
                });
            }
            res.send(post);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "post not found with id " + req.params.postId
            });
        }
        return res.status(500).send({
            message: "Error retrieving post with id " + req.params.postId
        });
    });
};

// Update a post identified by the postId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.description) {
        return res.status(400).send({
            message: "post description can not be empty"
        });
    }

    // Validate request
    if(!req.body.title) {
        return res.status(400).send({
            message: "post title can not be empty"
        });
    }

    // Find post and update it with the request body
    post.findByIdAndUpdate(req.params.postId, {
        title: req.body.title,
        description: req.body.description
    }, {new: true})
        .then(post => {
            if(!post) {
                return res.status(400).send({
                    message: "post not found with id " + req.params.postId
                });
            }
            res.send(post);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "post not found with id " + req.params.postId
            });
        }
        return res.status(500).send({
            message: "Error updating post with id " + req.params.postId
        });
    });
};


// Delete a post with the specified postId in the request
exports.delete = (req, res) => {
    post.findByIdAndRemove(req.params.postId)
        .then(post => {
            if(!post) {
                return res.status(404).send({
                    message: "post not found with id " + req.params.postId
                });
            }
            res.send({message: "post deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "post not found with id " + req.params.postId
            });
        }
        return res.status(500).send({
            message: "Could not delete post with id " + req.params.postId
        });
    });
};
