const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    topic: {
        type: String,
        required: true
    }
});

const Forum = mongoose.model('forum', ForumSchema);

const forum = new Forum({
    topic: 'dummy'
}).save();

module.exports = Forum;