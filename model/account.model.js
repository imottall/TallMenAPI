const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    replies: [{ type: Schema.Types.ObjectId, ref: 'reply' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'post' }]
});

const Account = mongoose.model('account', AccountSchema);

module.exports = Account;