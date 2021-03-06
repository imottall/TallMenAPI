const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    message: {
        type: String,
        required: true
    },
    account: { type: Schema.Types.ObjectId, ref: 'account' },
    replyToAuthor: { type: Schema.Types.ObjectId, ref: 'account' }
});

const Reply = mongoose.model('reply', ReplySchema);

module.exports = Reply;