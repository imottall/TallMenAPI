const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    forums: [{
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
            replies: [{
                message: {
                    type: String,
                    required: true
                },
                author: {
                    type: String,
                    required: false
                }
            }]
        }]
    }]
}, {
    timestamps: true
});


const Forum = mongoose.model('forum', ForumSchema);

// Add a 'dummy' user (every time you require this file!)
const forum = new Forum({
    forums: [{topic: 'dummy'}]
}).save();

module.exports = Forum;