const mongoose = require('mongoose');

PostSchema = mongoose.Schema({
    title: String,
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('posts', PostSchema);
