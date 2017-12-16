var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Accounts = require('../model/account.model');
var auth = require('../authentication/authentication');

//Login
routes.post('/accounts/login', function(req, res, next) {
    const account = req.body;

    Accounts.findOne({name: account.name})
        .then(response => {
            if(auth.verify(account.password, response.password)){
                res.status(200).json(response);
            } else {
                res.status(418).json(false);
            }})
        .catch((error) => res.status(400).json(error))
});

//Register
routes.post('/accounts', function(req, res) {
    const accountName = req.body.name;
    const accountPassword = auth.encode(req.body.password);
    const newAccount = new Accounts({
        name: accountName,
        password: accountPassword
    }).save()
        .then(response => {res.status(200).send(response)})
        .catch((error) => res.status(400).json(error))
});

//GetAccount
routes.get('/accounts/:accountId', function(req, res) {
    res.contentType('application/json');
    const accountId = req.params.accountId;

    Accounts.findOne({_id: accountId})
        .populate('posts')
        .populate('replies')
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(401).json(error));
});

module.exports = routes;