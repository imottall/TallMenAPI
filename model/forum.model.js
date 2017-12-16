const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account.model');

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

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }]
});

const ReplySchema = new Schema({
    message: {
        type: String,
        required: true
    },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    replyToAuthor: { type: Schema.Types.ObjectId, ref: 'Account' }
});

const Forum = mongoose.model('forum', ForumSchema);
const Post = mongoose.model('post', PostSchema);
const Reply = mongoose.model('reply', ReplySchema);

module.exports = Forum;
module.exports = Post;
module.exports = Reply;