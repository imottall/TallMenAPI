var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Account = require('../model/account.model');
var Auth = require('../authentication/authentication');

routes.post('/login', function(req, res, next) {
    const account = req.body;

    Account.findOne({name: account.name})
        .then(response => {
            if(auth.verify(account.password, response.password)){
                res.status(200).json(response);
            } else {
                res.status(418).json(response);
            }})
        .catch((error) => res.status(400).json(error))
});

routes.post('/register', function(req, res) {
    const accountName = req.body.name;
    const accountPassword = auth.encode(req.body.password);
    const newAccount = new Account({
        name: accountName,
        password: accountPassword
    }).save()
        .then(response => {res.status(200).send(response)})
        .catch((error) => res.status(400).json(error))
});

module.exports = routes;