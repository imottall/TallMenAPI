const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    message: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: false
    },
    replyToAuthorId: {
        type: String,
        required: false
    },
    postId: {
        type: String,
        required: true
    }
});

const Reply = mongoose.model('reply', ReplySchema);

module.exports = Reply;