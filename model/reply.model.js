const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account.model');

const ReplySchema = new Schema({
    message: {
        type: String,
        required: true
    },
    account: { type: Schema.Types.ObjectId, ref: Account },
    replyToAuthor: { type: Schema.Types.ObjectId, ref: 'Account' },
});

const Reply = mongoose.model('reply', ReplySchema);

module.exports = Reply;