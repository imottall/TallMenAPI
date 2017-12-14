const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    ForumId: {
        type: String,
        required: true
    }
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;