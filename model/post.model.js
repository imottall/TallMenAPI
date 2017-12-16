const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Post = mongoose.model('post', PostSchema);

module.exports = Post;