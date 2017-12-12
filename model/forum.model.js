const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    posts: [ Post ]
});


const Forum = mongoose.model('forum', ForumSchema);

// Add a 'dummy' user (every time you require this file!)
const forum = new Forum({
    topic: 'dummy', posts:
        [{title: 'Im bloody amazing', author: 'moi', message: "I'm amazing because, you know, that's just what I am",
            replies: [{message: 'meow' }]
        }]
}).save();

module.exports = Forum;