const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const posts = require('./post.model');

const ForumSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }]
});

const Forum = mongoose.model('forum', ForumSchema);

module.exports = Forum;