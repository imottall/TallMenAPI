var express = require('express');
var routes = express.Router();
var neo4j = require('neo4j-driver').v1;
var driver =
    neo4j.driver("bolt://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24786",
        neo4j.auth.basic("admin", "b.gj4kU3HhDiFG.hhoE5SZipR0xvYXl"));

routes.get('/games', function(req, res){
    var session = driver.session();
    session
        .run("MATCH (g:Game) RETURN g.name AS name, g.genre AS genre, g.wallpaperImagePath AS wallpaperImagePath, g.coverImagePath AS coverImagePath")
        .then(function(result) {
            result.records.forEach(function(record){
                console.log(record.get('name'))
            });
            res.status(200).json(result.records);
            session.close();
        })
        .catch(function(error){
            console.log("Error: " + error);
            res.status(418).json(error);
        })
});

module.exports = routes;