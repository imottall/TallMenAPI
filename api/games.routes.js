var express = require('express');
var routes = express.Router();
var neo4j = require('neo4j-driver').v1;
var driver =
    neo4j.driver("bolt://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24786",
        neo4j.auth.basic("admin", "b.gj4kU3HhDiFG.hhoE5SZipR0xvYXl"));
var session = driver.session();

routes.get('/games', function(req, res){
    session
        .run("MATCH (g:Game) RETURN DISTINCT {name: g.name, genre: g.genre, backstory: g.backstory, coverImagePath: g.coverImagePath, wallpaperImagePath: g.walwallPaperImagePath} AS game")
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

routes.get('/:gameName/characters', function(req, res){
    const gameName = req.params.gameName;
    session
        .run("MATCH (g:Game)-[:hasCharacter]-> (c:Character) WHERE g.name = '" + gameName + "'RETURN {name: c.name, backstory: c.backstory, portraitImagePath: c.portraitImagePath} AS character")
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

module.exports = routes;