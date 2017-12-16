var express = require('express');
var routes = express.Router();
var neo4j = require('neo4j-driver').v1;
var driver =
    neo4j.driver("bolt://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24786",
        neo4j.auth.basic("admin", "b.gj4kU3HhDiFG.hhoE5SZipR0xvYXl"));
var session = driver.session();

/**
 * GAMES
 */

// Get
routes.get('/games/get', function(req, res){
    session
        .run("MATCH (g:Game) RETURN DISTINCT {name: g.name, genre: g.genre, coverImagePath: g.coverImagePath, wallpaperImagePath: g.wallpaperImagePath} AS game")
        .then(function(result) {
            result.records.forEach(function(record){
                console.log(record)
            });
            res.status(200).json(result.records);
            session.close();
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
    session.close()
});

// Update
routes.post('/games/:gameName/update', function(req, res){
    const gameName = req.params.gameName;
    const updatedGame = req.body;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'}) SET g.name = '" + updatedGame.name +
            "', SET g.genre = '" + updatedGame.genre +
            "', SET g.wallpaperImagePath = '" + updatedGame.wallpaperImagePath +
            "', SET g.coverImagePath = '" + updatedGame.coverImagePath + '";')
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
    session.close()
});

// Create
routes.post('/games/create', function(req, res){
    const newGame = req.body;
    session
        .run("CREATE (g:Game{name:'" + newGame.name +
            "', g.genre = '" + newGame.genre +
            "', g.wallpaperImagePath = '" + newGame.wallpaperImagePath +
            "', g.coverImagePath = '" + newGame.coverImagePath + '";')
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
    session.close()
});

// Delete
routes.delete('/games/:gameName/delete', function(req, res){
    const gameName = req.params.gameName;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'}) DELETE g")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
    session.close()
});

/**
 * CHARACTERS
 */

// Get
routes.get('/:gameName/characters/get', function(req, res){
    const gameName = req.params.gameName;
    session
        .run("MATCH (g:Game)-[:hasCharacter]-> (c:Character) WHERE g.name = '" + gameName + "'RETURN {name: c.name, backstory: c.backstory, portraitImagePath: c.portraitImagePath} AS character")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
    session.close()
});

// Create Character and relation to game
routes.post('/:gameName/characters/create', function(req, res){
    const gameName = req.params.gameId;
    const character = req.body;
    session
        .run("MATCH (g:Game{name: '" + gameName +
            "') CREATE (g)-[:hasCharacter]->(c:Character{name:'" + character.name +
            "',backstory:'" + character.backstory +
            "', portraitImagePath: '" + character.portraitImagePath + "'});")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
});

// Update
routes.post('/characters/:characterName/update', function(req, res){
    const characterName = req.params.characterName;
    const character = req.body;
    session
        .run("MATCH (c:Character {name: '" + characterName +
            "'}) SET c.name:'" + character.name +
            "', c.backstory:'" + character.backstory +
            "', c.portraitImagePath: '" + character.portraitImagePath + "';")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
});

// Delete
routes.delete('/characters/:characterName/delete', function(req, res){
    const characterName = req.params.characterName;
    session
        .run("MATCH (c:Character{name:'" + characterName + "'}) DELETE c")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
    session.close()
});

/**
 * RELATIONS
 */

// Create Character and relation to game
routes.post('/:gameName/:characterName/relations/create', function(req, res){
    const gameName = req.params.gameName;
    const characterName = req.params.characterName;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'}), (c:Character{name:'" + characterName +
            "'}) CREATE (g)-[:hasCharacter]->(c);")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
});

routes.delete('/:gameName/:characterName/relations/delete', function(req, res){
    const gameName = req.params.gameName;
    const characterName = req.params.characterName;
    session
        .run("MATCH (g:Game{name:'" + gameName + "'})-[r:hasCharacter]->(c:Character{name:'" + characterName +
            "'}) DELETE r;")
        .then(function(result) {
            res.status(200).json(result.records);
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        });
});



module.exports = routes;