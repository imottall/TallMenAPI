process.env.NODE_ENV = 'test';

var driver = require('../config/neo.db');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var chould = chai.should();
chai.use(chaiHttp);

describe('GAMES_FUNCTIONALITY', function() {
    var session = driver.session();
    var testGame = {
        name: "test",
        genre: "test",
        wallpaperImagePath: "test",
        coverImagePath: "test"
    };

    session.run("MATCH (n) REMOVE(N);");

    it('can create a new Game', function (done) {
        chai.request(server)
            .post('/games/create')
            .send(testGame)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('can find and return all games', function (done) {
        chai.request(server)
            .get('/games/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            })
    });

    it('can update an existing Game', function (done) {
        testGame = {
            name: "updatedtest",
            genre: "updatedtest",
            wallpaperImagePath: "updatedtest",
            coverImagePath: "updatedtest"
        };
        chai.request(server)
            .post('/games/test/update')
            .send(testGame)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('wont crash if we try to update a not existing game', function (done) {
        var testGame = {
            name: "notexisting",
            genre: "updatedtest",
            wallpaperImagePath: "updatedtest",
            coverImagePath: "updatedtest"
        };
        chai.request(server)
            .post('/games/test/update')
            .send(testGame)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('can delete a Game', function (done) {
        chai.request(server)
            .delete('/games/' + testGame.name + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    it('wont crash if we try to delete a not existing Game', function (done) {
        chai.request(server)
            .delete('/games/iDoNotExist/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    session.run("MATCH (n) REMOVE(N);");
    session.close();
});

describe('CHARACTERS_FUNCTIONALITY', function() {
    var session = driver.session();
    var testCharacter = {
        name: "test",
        backstory: "test",
        portraitImagePath: "test"
    };
    var testGame = {
        name: "test",
        genre: "test",
        wallpaperImagePath: "test",
        coverImagePath: "test"
    };

    session.run("MATCH (n) REMOVE(N);");

    it('REPEAT | create a new Game ', function (done) {
        chai.request(server)
            .post('/games/create')
            .send(testGame)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('can create a new Character which is related to our testGame ', function (done) {
        chai.request(server)
            .post('/'+testGame.name+'/characters/create')
            .send(testCharacter)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('can update a already existing Character', function (done) {
        testCharacter = {
            name: "update",
            backstory: "update",
            portraitImagePath: "update"
        };
        chai.request(server)
            .post('/characters/test/update')
            .send(testCharacter)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('wont crash if we try to update a not existing Character', function (done) {
        chai.request(server)
            .post('/characters/idonotexist/update')
            .send(testCharacter)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('returns characters ', function (done) {
        chai.request(server)
            .get('/' + testGame.name + '/characters/get')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            })
    });

    it('can delete a existing character ', function (done) {
        chai.request(server)
            .delete('/characters/' + testCharacter.name + '/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    it('wont crash if we try to delete a not existing character ', function (done) {
        chai.request(server)
            .delete('/characters/idonotexist/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    session.run("MATCH (n) REMOVE(N);");
    session.close();
});

describe('RELATIONS_FUNCTIONALITY', function() {
    var session = driver.session();
    var testCharacter = {
        name: "test",
        backstory: "test",
        portraitImagePath: "test"
    };
    var testGame = {
        name: "test",
        genre: "test",
        wallpaperImagePath: "test",
        coverImagePath: "test"
    };

    session.run("MATCH (n) REMOVE(N);");

    it('REPEAT | create a game ', function (done) {
        chai.request(server)
            .post('/games/create')
            .send(testGame)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('REPEAT | Creating a character related to game ', function (done) {
        chai.request(server)
            .post('/'+testGame.name+'/characters/create')
            .send(testCharacter)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('can remove a existing relationship', function (done) {
        chai.request(server)
            .delete('/' + testGame.name + '/' + testCharacter.name + '/relations/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    it('wont crash if we try to remove a not existing relationship', function (done) {
        chai.request(server)
            .delete('/' + testGame.name + '/' + testCharacter.name + '/relations/delete')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    });

    it('can create a relationship', function (done) {
        chai.request(server)
            .post('/' + testGame.name + '/' + testCharacter.name + '/relations/create')
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    it('wont crash if we try to create a relationship that already exists', function (done) {
        chai.request(server)
            .post('/' + testGame.name + '/' + testCharacter.name + '/relations/create')
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('array');
                done();
            })
    });

    session.run("MATCH (n) REMOVE(N);");
    session.close();
});
