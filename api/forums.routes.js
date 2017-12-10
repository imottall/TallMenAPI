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
        .then((forum) => res.status(200).json(forum))
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
    .then(post => res.send(post))
    .catch((error) => res.status(400).json(error))
});

/**
 * Returns all the replies from a specific post
 */
routes.get('/:forumID/:postID/replies', function(req,res) {
    const forumId = req.params.forumID;
    const postId = req.params.postID;

    Forum.find({_id: forumId},{posts: { $elemMatch: { _id: postId}}})
        .then((forum) => res.status(200).json(forum))
        .catch((error) => res.status(400).json(error));
});

/**
 * Add a new reply to a specific post
 */
routes.post('/:forumID/:postID/newReply', function(req, res, next) {
    const forumId = req.params.forumID;
    const postId = req.params.postID;
    const newReply = req.body;

    Forum.findOneAndUpdate({ "_id": forumId, "posts._id": postId},
        { "$push":
            {"posts.$.replies": newReply
            }
        }
    )
            .then(reply => res.send(reply))
            .catch((error) => res.status(400).json(error))
});

/**
 * Add a reply to a reply
 */
routes.post('/:forumID/:postID/:replyID/newReply', function(req, res, next) {
    const forumId = req.params.forumID;
    const postId = req.params.postID;
    const replyId = req.params.replyID;
    const newReply = req.body;

    Forum.findOneAndUpdate({ "_id": forumId, "posts._id": postId, "replies._id": replyId},
        { "$push":
            {"replies.$.replies": newReply
            }
        }
    )
        .then(reply => res.send(reply))
.catch((error) => res.status(400).json(error))
});
module.exports = routes;