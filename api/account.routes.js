var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Account = require('../model/account.model');

var auth = require('../auth/authentication');

routes.post('/login', function(req, res, next) {
    const account = req.body;

    Account.find({name: account.name}, {password: account.password})
        .then(response => res.status(200).send(response))
        .catch((error) => res.status(400).json(error))
});

routes.post('/register', function(req, res) {
    const account = req.body;

    Account.insert(account)
        .then(response => res.send(response))
        .catch(error => res.status(400).json(error))
});

// Hiermee maken we onze router zichtbaar voor andere bestanden.
module.exports = routes;