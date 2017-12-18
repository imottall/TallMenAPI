process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
mongoose.connection = require('../config/mongo.db');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var chould = chai.should();
chai.use(chaiHttp);

describe('FORUMS_FUNCTIONALITY', function() {
    var _id;
    var testForum = {
        topic: "test"
    };

    mongoose.connection.collections.forums.drop();

    it('can create a forum', function (done) {
        chai.request(server)
            .post('/forums/create')
            .send(testForum)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('topic').that.is.a('string');
                res.body.topic.should.equal(testForum.topic);
                done();
            })
    });

    it('cant create a forum with incomplete data', function (done) {
        var empty = { };
        chai.request(server)
            .post('/forums/create')
            .send(empty)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            })
    });

    it('can get all the existing forums', function (done) {
        chai.request(server)
            .get('/forums/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body[0].should.have.property('_id').that.is.a('string');
                _id = res.body[0]._id;
                done();
            })
    });

    it('can update a forum by id', function(done) {
        testForum = {
            topic: 'updated'
        };
        chai.request(server)
            .post('/forums/' + _id + '/update')
            .send(testForum)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                done();
            })
    });

    it('cant update a forum with incomplete data', function(done) {
        var emptyForum = { topic: null};
        chai.request(server)
            .post('/forums/' + _id + '/update')
            .send(emptyForum)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('topic').that.is.a('string');
                res.body.topic.should.equal(testForum.topic);
                done();
            })
    });

    it('can delete a forum by id', function(done) {
        chai.request(server)
            .delete('/forums/' + _id + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    it('wont crash when trying to delete a not existing forum', function(done) {
        chai.request(server)
            .delete('/forums/' + _id + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    mongoose.connection.collections.forums.drop();
});

describe('POSTS_FUNCTIONALITY', function() {
    var forum_id;
    var user_id;
    var post_id;
    var testPost;
    var testForum = {
        topic: "test"
    };
    var testUser = {
        name: "test",
        password: "testwoord"
    };

    mongoose.connection.collections.forums.drop();
    mongoose.connection.collections.posts.drop();

    it('REPEAT | can create a forum', function (done) {
        chai.request(server)
            .post('/forums/create')
            .send(testForum)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                forum_id = res.body._id;
                done();
            })
    });

    it('REPEAT | can create a user', function (done) {
        chai.request(server)
            .post('/accounts/register')
            .send(testUser)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                user_id = res.body._id;
                done();
            })
    });

    testPost = {
        title: "test",
        message: "test",
        account: user_id
    };

    it('can create a new post', function (done) {
        chai.request(server)
            .post('/' + forum_id + '/posts/create')
            .send(testPost)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                res.body[0].should.have.property('title').that.is.a('string');
                res.body[0].title.should.equal(testPost.title);
                res.body[0].should.have.property('_id').that.is.a('string');
                post_id = res.body[0]._id;
                done();
            })
    });

    it('cant create a post without title', function (done) {
        var emptyPost = { message: 'living titleless is the only way' };
        chai.request(server)
            .post('/' + forum_id + '/posts/create')
            .send(emptyPost)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            })
    });

    it('can get all existing posts for a specific forum', function (done) {
        chai.request(server)
            .get('/' + forum_id + '/posts/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('posts').that.is.a('array');
                done();
            })
    });

    it('can get all existing posts for a forum found by game', function (done) {
        chai.request(server)
            .get('/' + testForum.topic + '/game/posts/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('topic').that.is.a('string');
                res.body.topic.should.equal(testForum.topic);
                done();
            })
    });

    it('can update a existing post by id', function (done) {
        testPost = {
            title: "updated",
            message: "updated",
            account: user_id
        };
        chai.request(server)
            .post('/posts/' + post_id + '/update')
            .send(testPost)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                done();
            })
    });

    it('cant update a existing post with wrong data', function (done) {
        var updatedPost = { title: null };
        chai.request(server)
            .post('/posts/' + post_id + '/update')
            .send(updatedPost)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('title').that.is.a('string');
                res.body.title.should.equal(testPost.title);
                done();
            })
    });

    it('can delete a existing post by id', function (done) {
        chai.request(server)
            .delete('/posts/' + post_id + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    it('doesnt crash when we try to delete a  not existing post by id', function (done) {
        chai.request(server)
            .delete('/posts/' + post_id + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    mongoose.connection.collections.forums.drop();
    mongoose.connection.collections.posts.drop();
    mongoose.connection.collections.accounts.drop();
});

describe('POSTS_FUNCTIONALITY', function() {
    var forum_id;
    var account_id;
    var post_id;
    var reply_id;
    var testPost;
    var testReply;
    var testForum = {
        topic: "test"
    };
    var testUser = {
        name: "testuser",
        password: "test"
    };

    mongoose.connection.collections.forums.drop();
    mongoose.connection.collections.posts.drop();
    mongoose.connection.collections.accounts.drop();
    mongoose.connection.collections.replies.drop();

    it('REPEAT | can create a forum', function (done) {
        chai.request(server)
            .post('/forums/create')
            .send(testForum)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                forum_id = res.body._id;
                done();
            })
    });

    it('REPEAT | can create a user', function (done) {
        chai.request(server)
            .post('/accounts/register')
            .send(testUser)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                account_id = res.body._id;
                done();
            })
    });

    testPost = {
        title: "test",
        message: "test",
        account: account_id
    };

    testReply = {
        message: "test",
        account: account_id,
        replyToAuthor: account_id
    };

    it('REPEAT | can create a new post', function (done) {
        chai.request(server)
            .post('/' + forum_id + '/posts/create')
            .send(testPost)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                res.body[0].should.have.property('_id').that.is.a('string');
                post_id = res.body[0]._id;
                done();
            })
    });

    it('can create a new reply to a specific post ', function (done) {
        chai.request(server)
            .post('/' + post_id + '/replies/create')
            .send(testReply)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                res.body[0].should.have.property('message').that.is.a('string');
                res.body[0].message.should.equal(testReply.message);
                res.body[0].should.have.property('_id').that.is.a('string');
                reply_id = res.body[0]._id;
                done();
            })
    });

    it('cant create a new reply without message ', function (done) {
        var emptyReply = { account: account_id, replyToAuthor: account_id };
        chai.request(server)
            .post('/' + post_id + '/replies/create')
            .send(emptyReply)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            })
    });

    it('can return all the existing replies ', function (done) {
        chai.request(server)
            .get('/' + post_id + '/replies/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                done();
            })
    });

    it('can update a existing reply by id', function (done) {
        testReply = {
            message: "updated",
            account: account_id,
            replyToAuthor: account_id
        };
        chai.request(server)
            .post('/replies/' + reply_id + '/update')
            .send(testReply)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                done();
            })
    });

    it('cant update a existing reply with wrong data', function (done) {
        var updatedReply = { message: null };
        chai.request(server)
            .post('/replies/' + reply_id + '/update')
            .send(updatedReply)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('message').that.is.a('string');
                res.body.message.should.equal(testReply.message);
                done();
            })
    });

    it('can delete a existing reply by id', function (done) {
        chai.request(server)
            .delete('/replies/' + reply_id + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    it('wont crash if we try to delete a not existing reply by id', function (done) {
        chai.request(server)
            .delete('/replies/' + reply_id + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    mongoose.connection.on('open', function(){
        mongoose.connection.db.dropDatabase(function(err){
            console.log(err);
        });
    });
});

describe('REFERENCES', function() {
    var forum_id;
    var account_id;
    var post_id;
    var reply_id;
    var testPost;
    var testReply;
    var testForum = {
        topic: "test"
    };
    var testUser = {
        name: "tester",
        password: "test"
    };

    mongoose.connection.collections.forums.drop();
    mongoose.connection.collections.posts.drop();
    mongoose.connection.collections.accounts.drop();
    mongoose.connection.collections.replies.drop();

    it('REPEAT | can create a forum', function (done) {
        chai.request(server)
            .post('/forums/create')
            .send(testForum)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                forum_id = res.body._id;
                done();
            })
    });

    it('REPEAT | can create a user', function (done) {
        chai.request(server)
            .post('/accounts/register')
            .send(testUser)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                account_id = res.body._id;
                done();
            })
    });

    it('REPEAT | can create a new post', function (done) {
        testPost = {
            title: "test",
            message: "test",
            account: account_id
        };
        chai.request(server)
            .post('/' + forum_id + '/posts/create')
            .send(testPost)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                res.body[0].should.have.property('_id').that.is.a('string');
                post_id = res.body[0]._id;
                done();
            })
    });

    it('REPEAT | can create a new reply to a specific post ', function (done) {
        testReply = {
            message: "test",
            account: account_id,
            replyToAuthor: account_id
        };
        chai.request(server)
            .post('/' + post_id + '/replies/create')
            .send(testReply)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                res.body[0].should.have.property('message').that.is.a('string');
                res.body[0].message.should.equal(testReply.message);
                res.body[0].should.have.property('_id').that.is.a('string');
                reply_id = res.body[0]._id;
                done();
            })
    });

    it('has placed a reference to the new post within the existing forum ', function (done) {
        chai.request(server)
            .get('/' + forum_id + '/posts/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('posts').that.is.a('array');
                res.body.posts[0].should.have.property('_id').that.is.a('string');
                res.body.posts[0]._id.should.equal(post_id);
                done();
            })
    });

    it('has placed a reference to the new post within users account ', function (done) {
        chai.request(server)
            .get('/accounts/' + account_id + '/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('posts').that.is.a('array');
                res.body.posts[0].should.have.property('_id').that.is.a('string');
                res.body.posts[0]._id.should.equal(post_id);
                done();
            })
    });

    it('has placed a reference to the new reply within the post ', function (done) {
        chai.request(server)
            .get('/' + post_id + '/replies/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('replies').that.is.a('array');
                res.body.replies[0].should.have.property('_id').that.is.a('string');
                res.body.replies[0]._id.should.equal(reply_id);
                done();
            })
    });

    it('has placed a reference to the new post within users account ', function (done) {
        chai.request(server)
            .get('/accounts/' + account_id + '/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('replies').that.is.a('array');
                res.body.replies[0].should.have.property('_id').that.is.a('string');
                res.body.replies[0]._id.should.equal(reply_id);
                done();
            })
    });

    mongoose.connection.on('open', function(){
        mongoose.connection.db.dropDatabase(function(err){
            console.log(err);
        });
    });
});
