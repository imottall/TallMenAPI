var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Forums = require('../model/forum.model');
var Posts = require('../model/post.model');
var Replies = require('../model/reply.model');
var Accounts = require('../model/account.model');

/**********
 * FORUMS *
 **********/

//.populate({ path:'posts', model:'Post'})

//GET
routes.get('/forums', function(req, res) {
    res.contentType('application/json');
    Forums.find({})
        .populate('posts')
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(401).json(error));
});

//NEW
routes.post('/forums', function(req, res, next) {
    const newForum = req.body;
    new Forums(
        newForum
    ).save()
        .then(response => res.status(200).send(response))
        .catch((error) => res.status(400).json(error))
});

//UPDATE
routes.post('/forums/:forumId', function(req,res){
    const forumId = req.params.forumId;
    const newForum = req.body;

    Forums.findOneAndUpdate({_id: forumId}, newForum)
        .then(response => res.status(200).send(response))
        .catch((error) => res.status(400).json(error))
});

//DELETE
routes.delete('/forums/:forumId', function(req, res, next) {
    const forumId = req.params.forumId;

    Forums.remove({ _id: replyId})
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(400).json(error));
});

/*********
 * POSTS *
 *********/

//GET
routes.get('/:forumId/posts', function(req, res) {
    res.contentType('application/json');
    const forumId = req.params.forumId;

    Forums.findOne({_id: forumId})
        .populate('posts')
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(401).json(error));
});

//NEW
/**
routes.post('/:forumId/posts', function(req, res, next) {
    const forumId = req.params.forumId;
    newPost = new Posts(req.body);

    Promise.all([
        new Posts(newPost).save(),
        Forums.findOneAndUpdate({_id: forumId},{ $push: { posts: newPost }})
    ])  .then(response => {res.status(200).send(response)})
        .catch((error) => res.status(400).json(error))
});
 **/

//NEW WITH AUTHOR
routes.post('/:forumId/posts', function(req, res, next) {
    const forumId = req.params.forumId;
    newPost = new Posts(req.body);

    Promise.all([
        new Posts(newPost).save(),
        Forums.findOneAndUpdate({_id: forumId},{ $push: { posts: newPost }}),
        Accounts.findOneAndUpdate({_id: newPost.account},{ $push: { posts: newPost }})
    ])  .then(response => {res.status(200).send(response)})
.catch((error) => res.status(400).json(error))
});

//UPDATE
routes.post('/posts/:postId', function(req,res){
    const postId = req.params.postId;
    const newPost = req.body;

    Posts.findOneAndUpdate({_id: postId}, newPost)
        .then(response => res.status(200).send(response))
        .catch((error) => res.status(400).json(error))
});

//DELETE
routes.delete('/posts/:postId', function(req, res, next) {
    const postId = req.params.postId;

    Posts.remove({ _id: postId})
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(400).json(error));
});

/*********
 * REPLIES *
 *********/

//GET
routes.get('/:postId/replies', function(req, res) {
    res.contentType('application/json');
    const postId = req.params.postId;

    Posts.findOne({_id: postId})
        .populate('replies')
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(401).json(error));
});

//NEW
/**
routes.post('/:postId/replies', function(req, res, next) {
    const postId = req.params.postId;
    newReply = new Replies(req.body);

    Promise.all([
        new Replies(newReply).save(),
        Posts.findOneAndUpdate({_id: postId},{ $push: { replies: newReply }})
    ])  .then(response => {res.status(200).send(response)})
.catch((error) => res.status(400).json(error))
});
**/
//NEW WITH AUTHOR
routes.post('/:postId/replies', function(req, res, next) {
    const postId = req.params.postId;
    newReply = new Replies(req.body);

    Promise.all([
        new Replies(newReply).save(),
        Posts.findOneAndUpdate({_id: postId},{ $push: { replies: newReply }}),
        Accounts.findOneAndUpdate({_id: newReply.account}, {$push: {replies: newReply}})
    ])  .then(response => {res.status(200).send(response)})
        .catch((error) => res.status(400).json(error))
});

//UPDATE
routes.post('/replies/:replyId', function(req,res){
    const replyId = req.params.replyId;
    const newReply = req.body;

    Replies.findOneAndUpdate({_id: replyId}, newReply)
        .then(response => res.status(200).send(response))
        .catch((error) => res.status(400).json(error))
});

//DELETE
routes.delete('/replies/:replyId', function(req, res, next) {
    const replyId = req.params.replyId;

    Replies.remove({ _id: replyId})
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(400).json(error));
});

module.exports = routes;