var express = require('express');
var routes = express.Router();
var driver = require('../config/neo.db');

/**
 * GAMES
 */

// Get
routes.get('/games/get', function(req, res){
    var session = driver.session();
    session
        .run("MATCH (g:Game) RETURN DISTINCT {name: g.name, genre: g.genre, coverImagePath: g.coverImagePath, wallpaperImagePath: g.wallpaperImagePath, forumId: g.forumId} AS game")
        .then(function(result) {
            res.status(200).json(result.records);
            session.close();
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close()
});

// Update
routes.post('/games/:gameName/update', function(req, res){
    var session = driver.session();
    const gameName = req.params.gameName;
    const updatedGame = req.body;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'}) SET g.name = '" + updatedGame.name +
            "' SET g.genre = '" + updatedGame.genre +
            "' SET g.wallpaperImagePath = '" + updatedGame.wallpaperImagePath +
            "' SET g.coverImagePath = '" + updatedGame.coverImagePath +
            "' SET g.forumId = '" + updatedGame.forumId + "';")
        .then(function(result) {
            res.status(201).json(result.records);
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close()
});

// Create
routes.post('/games/create', function(req, res){
    var session = driver.session();
    const newGame = req.body;
    session
        .run("CREATE (g:Game{name:'" + newGame.name +
            "', genre:'" + newGame.genre +
            "', wallpaperImagePath:'" + newGame.wallpaperImagePath +
            "', coverImagePath:'" + newGame.coverImagePath +
            "', forumId:'" + newGame.forumId + "'});")
        .then(function(result) {
            res.status(201).json(result.records);
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close()
});

// Delete
routes.delete('/games/:gameName/delete', function(req, res){
    var session = driver.session();
    const gameName = req.params.gameName;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'}) DETACH DELETE g")
        .then(function(result) {
            res.status(204).send();
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close()
});

/**
 * CHARACTERS
 */

// Get
routes.get('/:gameName/characters/get', function(req, res){
    var session = driver.session();
    const gameName = req.params.gameName;
    session
        .run("MATCH (g:Game)-[:hasCharacter]-> (c:Character) WHERE g.name = '" + gameName + "'RETURN {name: c.name, backstory: c.backstory, portraitImagePath: c.portraitImagePath} AS character")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close()
});

// Create Character and relation to game
routes.post('/:gameName/characters/create', function(req, res){
    var session = driver.session();
    const gameName = req.params.gameName;
    const character = req.body;
    session
        .run("MATCH (g:Game{name: '" + gameName +
            "'}) CREATE (g)-[:hasCharacter]->(c:Character{name:'" + character.name +
            "',backstory:'" + character.backstory +
            "', portraitImagePath: '" + character.portraitImagePath + "'});")
        .then(function(result) {
            res.status(201).json(result.records);
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close();
});

// Update
routes.post('/characters/:characterName/update', function(req, res){
    var session = driver.session();
    const characterName = req.params.characterName;
    const character = req.body;
    session
        .run("MATCH (c:Character {name: '" + characterName +
            "'}) SET c.name = '" + character.name +
            "', c.backstory = '" + character.backstory +
            "', c.portraitImagePath = '" + character.portraitImagePath + "';")
        .then(function(result) {
            res.status(201).json(result.records);
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close();
});

// Delete
routes.delete('/characters/:characterName/delete', function(req, res){
    var session = driver.session();
    const characterName = req.params.characterName;
    session
        .run("MATCH (c:Character{name:'" + characterName + "'}) DETACH DELETE c")
        .then(function(result) {
            res.status(204).send();
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close()
});

/**
 * RELATIONS
 */

// Create relation between character and game
routes.post('/:gameName/:characterName/relations/create', function(req, res){
    var session = driver.session();
    const gameName = req.params.gameName;
    const characterName = req.params.characterName;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'}), (c:Character{name:'" + characterName +
            "'}) CREATE (g)-[:hasCharacter]->(c);")
        .then(function(result) {
            res.status(201).json(result.records);
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close();
});

// Remove relation between character and game
routes.delete('/:gameName/:characterName/relations/delete', function(req, res){
    var session = driver.session();
    const gameName = req.params.gameName;
    const characterName = req.params.characterName;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'})-[r:hasCharacter]->(c:Character{name:'" + characterName +
            "'}) DETACH DELETE r;")
        .then(function(result) {
            res.status(204).send();
        })
        .catch(function(error){
            res.status(400).json(error);
        });
    session.close();
});



module.exports = routes;