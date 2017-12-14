var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Fora = require('../model/forum.model');
var Posts = require('../model/post.model');
var Replies = require('../model/reply.model');

/*
 * Returns all the forums
 */
routes.get('/forums', function(req, res) {
    res.contentType('application/json');
    Fora.find({})
        .then((fora) => res.status(200).json(fora))
        .catch((error) => res.status(401).json(error));
});

/**
 * Returns all the posts from a specific forum
 */
routes.get('/:id/posts', function(req,res) {
    const forumId = req.params.id;

    Posts.find({ForumId: forumId},{posts:1,_id: 1})
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json(error));
});

/**
 * Add a new post to a specific forum
 */
routes.post('/forum/newPost', function(req, res, next) {
    const newPost = req.body;

    new Posts(
        newPost
    ).save()
        .then(response => res.status(200).send(response))
        .catch((error) => res.status(400).json(error))
});

/**
 * Returns all the replies from a specific post
 */
routes.get('/forum/:postID/replies', function(req,res) {
    const postId = req.params.postID;

    Replies.find({postId: postId})
        .then((forum) => res.status(200).json(forum))
        .catch((error) => res.status(400).json(error));
});

/**
 * Add a new reply to a specific post
 */
routes.post('/forum/post/newReply', function(req, res, next) {
    const newReply = req.body;

    new Replies(
        newReply
    ).save()
        .then(response => res.status(200).send(response))
        .catch((error) => res.status(400).json(error))
});

/**
 * Delete a specific reply
 */
routes.get('/forums/posts/:replyID/delete', function(req,res) {
    const replyId = req.params.replyToID;
    Replies.remove({ _id: replyId})
        .then((forum) => res.status(200).json(forum))
        .catch((error) => res.status(400).json(error));
});

/**
 * Returns all the replies for a specific author
*/
routes.get('/forums/posts/:authorId/getReplies', function(req,res) {
    const authorID = req.params.authorId;
    Replies.find({authorId: authorID})
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json(error));
});

module.exports = routes;