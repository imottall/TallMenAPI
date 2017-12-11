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
    }
});


const Account = mongoose.model('account', AccountSchema);

// Add a 'dummy' user (every time you require this file!)
const account = new Account({
    name: 'Admin',
    password: 'wachtwoord'
}).save();

module.exports = Account;