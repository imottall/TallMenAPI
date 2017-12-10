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
    replies: Reply
});

const Reply = mongoose.model('reply', ReplySchema);

module.exports = Reply;