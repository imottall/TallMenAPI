const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }]
});

const Forum = mongoose.model('forum', ForumSchema);

module.exports = Forum;