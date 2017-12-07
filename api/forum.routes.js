var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Forum = require('../model/forum.model');

//
// Geef een lijst van alle users.
//
routes.get('/forums', function(req, res) {
    res.contentType('application/json');
    Forum.find({})
        .then((forums) => {
        // console.log(users);
        res.status(200).json(forums);
    })
    .catch((error) => res.status(401).json(error));
});

routes.post('/forum', function(req, res, next) {
    const forumReq = req.body;
    Recipe.create(forumReq)
        .then(forum => res.status(200).send(forum))
        .catch((error) => res.status(400).json(error))
});

module.exports = routes;