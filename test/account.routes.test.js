process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
mongoose.connection = require('../config/mongo.db');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var chould = chai.should();
chai.use(chaiHttp);

describe('ACCOUNT_FUNCTIONALITY', function() {
    var _id;
    var testAccount = {
        name: "test",
        password: "test"
    };

    mongoose.connection.collections.accounts.drop();

    it('can create a account', function (done) {
        chai.request(server)
            .post('/accounts/register')
            .send(testAccount)
            .end(function(err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                _id = res.body._id;
                done();
            })
    });

    it('cant create a account without username', function (done) {
        var testAccount = {
            name: null,
            password: 'invalid'
        };
        chai.request(server)
            .post('/accounts/register')
            .send(testAccount)
            .end(function(err, res) {
                res.should.not.have.status(401);
                res.body.should.be.an('object');
                done();
            })
    });

    it('cant create a account without password', function (done) {
        var testAccount = {
            name: 'invalid',
            password: null
        };
        chai.request(server)
            .post('/accounts/register')
            .send(testAccount)
            .end(function(err, res) {
                res.should.not.have.status(201);
                res.body.should.be.an('object');
                done();
            })
    });

    it('can find a account by id', function (done) {
        chai.request(server)
            .get('/accounts/' + _id + '/get')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                done();
            })
    });

    it('returns an error on POST /login with password == null ', function (done) {
        var testAccount = {
            username: "invalid",
            password: null
        };

        chai.request(server)
            .post('/accounts/login')
            .send(testAccount)
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.an('object');
                done();
            })

    });

    it('returns an error on POST /login with username == null ', function (done) {
        var testAccount = {
            username: null,
            password: "invalid"
        };

        chai.request(server)
            .post('/accounts/login')
            .send(testAccount)
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.an('object');
                done();
            })

    });

    it('returns an error on POST /login with invalid credentials ', function (done) {
        var testAccount = {
            username: "invalid",
            password: "invalid"
        };

        chai.request(server)
            .post('/accounts/login')
            .send(testAccount)
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.an('object');
                done();
            })
    });

    it('allows a login with correct credentials ', function(done) {
        chai.request(server)
            .post('/accounts/login')
            .send(testAccount)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id').that.is.a('string');
                done();
            })
    });

    it('can delete a account', function (done) {
        chai.request(server)
            .delete('/accounts/' + _id + '/delete')
            .end(function(err, res) {
                res.should.have.status(204);
                done();
            })

    });

    mongoose.connection.collections.accounts.drop();
});