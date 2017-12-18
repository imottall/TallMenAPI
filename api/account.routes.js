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
                res.status(400).json({"error": "Invalid credentials"});
            }})
        .catch((error) => res.status(400).json(error))
});

//Register
routes.post('/accounts/register', function(req, res) {
    const accountName = req.body.name;
    const accountPassword = auth.encode(req.body.password);
    const newAccount = new Accounts({
        name: accountName,
        password: accountPassword
    }).save()
        .then(response => {res.status(201).json(response); console.log(response)})
        .catch((error) => {res.status(400).json(error)})
});

//GetAccount
routes.get('/accounts/:accountId/get', function(req, res) {
    res.contentType('application/json');
    const accountId = req.params.accountId;

    Accounts.findOne({_id: accountId})
        .populate('posts')
        .populate('replies')
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(400).json(error));
});

//Update
routes.post('/accounts/:accountId/update', function(req, res) {
    const accountId = req.params.accountId;
    const accountName = req.body.name;
    const accountPassword = auth.encode(req.body.password);
    const newAccount = {
        name: accountName,
        password: accountPassword
    };

    Accounts.findOneAndUpdate({_id: accountId}, newAccount)
        .then(response => res.status(201).json(response))
        .catch((error) => res.status(400).json(error))
});


//Delete
routes.delete('/accounts/:accountId/delete', function(req, res) {
    res.contentType('application/json');
    const accountId = req.params.accountId;

    Accounts.remove({_id: accountId})
        .then((response) => res.status(204).send())
        .catch((error) => res.status(400).json(error));
});

module.exports = routes;