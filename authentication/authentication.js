var passwordHash = require('password-hash');
const hashString = 'iamasupersecretstring';

function encode(password){
    return passwordHash.generate(password)
}

function verify(password, hashedPassword){
    return passwordHash.verify(password, hashedPassword)
}

module.exports = {
    encode,
    verify
};