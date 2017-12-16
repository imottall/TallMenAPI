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
    account: { type: Schema.Types.ObjectId, ref: 'account' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'reply' }]
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;