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
    replies: { type: Schema.ObjectId, ref: 'ReplySchema'}
});

const ForumSchema = new Schema({
        topic: {
            type: String,
            required: true
        },
        posts: [{
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
            ForumSchema: {
                message: Forum
            },
            replies: [{ type: Schema.ObjectId, ref: 'ReplySchema' }]
        }]
});


const Forum = mongoose.model('forum', ForumSchema);

// Add a 'dummy' user (every time you require this file!)
const forum = new Forum({
        topic: 'dummy', posts:
        [{title: 'Im bloody amazing', author: 'moi', message: "I'm amazing because, you know, that's just what I am", replies:
            [{message: 'I agree', author: 'toi'},{message: 'totally you know', replies: [{message: 'go away'},{message: '16 year old scrub'}]}]
        }]
}).save();

module.exports = Forum;