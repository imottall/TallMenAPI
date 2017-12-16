const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = require('post.model');

const ForumSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

const Forum = mongoose.model('forum', ForumSchema);

module.exports = Forum;