const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    message: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    replies: [ this ]
});

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
    replies: [ ReplySchema ]
});

const ForumSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    posts: [ PostSchema ]
});

const Reply = mongoose.model('reply', ReplySchema);
const Forum = mongoose.model('forum', ForumSchema);
const Post = mongoose.model('post', PostSchema);

// Add a 'dummy' user (every time you require this file!)
const forum = new Forum({
    topic: 'dummy', posts:
        [{title: 'Im bloody amazing', author: 'moi', message: "I'm amazing because, you know, that's just what I am",
            replies: [{message: 'meow' }]
        }]
}).save();

module.exports = Reply;
module.exports = Post;
module.exports = Forum;