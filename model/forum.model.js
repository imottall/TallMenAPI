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
    replies: { type: Schema.ObjectId, ref: 'ReplySchema', required: false }
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
            replies: [ ReplySchema ]
            //replies: [{ type: Schema.ObjectId, ref: 'ReplySchema', required: false }]
        }]
});


const Forum = mongoose.model('forum', ForumSchema);

// Add a 'dummy' user (every time you require this file!)
const forum = new Forum({
        topic: 'dummy', posts:
        [{title: 'Im bloody amazing', author: 'moi', message: "I'm amazing because, you know, that's just what I am",
            replies: [{message: 'meow',replies: [{message: 'toi'}]}]
        }]
}).save();

module.exports = Forum;