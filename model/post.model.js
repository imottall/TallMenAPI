const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    replies: [ Reply ]
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;