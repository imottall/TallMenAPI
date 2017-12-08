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

/**
 * Returns all the posts from a specific forum
 */
routes.get('/:id/posts', function(req,res) {
    const forumId = req.params.id;

    Forum.find({_id: forumId},{posts:1,_id: 1})
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json(error));
});

/**
 * Add a new post to a specific forum
 */
routes.post('/:id/newPost', function(req, res, next) {
    const forumID = req.params.id;
    const newPost = req.body;

    Forum.update(
        {_id: forumID},
        { $push: { posts: newPost }}
    )
    .then(forum => res.send(forum))
    .catch((error) => res.status(400).json(error))
});

/**
 * Returns all the replies from a specific post
 * TODO: fix this
 */
routes.get('/:forumID/:postID/replies', function(req,res) {
    const forumId = req.params.forumID;
    const postId = req.params.postID;

    Forum.find({_id: forumId})
        .then(data.find({_id: postId})
            .then(replies => res.status(200).json(replies))
            .catch((error) => res.status(400).json(error));
            )
        .catch((error) => res.status(400).json(error));
});

/**
 * Add a new reply to a specific post
 * TODO: fix this
 */
routes.post('/forums/:id/newReply', function(req, res, next) {
    const postID = req.params.id;
    const newReply = req.body;

    Forum.update({_id: postID}, {$push: {replies: newReply}})
        .then(reply => res.send(reply))
        .catch((error) => res.status(400).json(error))
});

module.exports = routes;