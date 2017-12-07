var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Forum = require('../model/forum.model');

/**
 * Returns all the forums
 */
routes.get('/forums', function(req, res) {
    res.contentType('application/json');
    Forum.find({})
        .then((forums) => res.status(200).json(forums))
    .catch((error) => res.status(401).json(error));
});

routes.get('/:id/posts', function(req,res) {
    const forumId = req.params.id;

    Forum.findOne({_id: forumId})
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json(error));
});

/**
 * Add a new post to a specific forum
 */
routes.post('/forums/:id', function(req, res, next) {
    const forumID = req.params.id;
    const newPost = req.body;

    Forum.update(
        {_id: forumID},
        { $addToSet: { posts: [newPost] }}
    )
    .then(forum => res.send(forum))
    .catch((error) => res.status(400).json(error))
});


module.exports = routes;