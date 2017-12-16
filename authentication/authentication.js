var passwordHash = require('password-hash');
const hashString = 'iamasupersecretstring';

function encode(password){
    return passwordHash.generate(password)
}

function verify(password, hashedPassword){
    console.log(password, hashedPassword);
    console.log(passwordHash.verify(password, hashedPassword));
    return passwordHash.verify(password, hashedPassword)
}

module.exports = {
    encode,
    verify
};