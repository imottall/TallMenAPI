var express = require('express');
var routes = express.Router();
var neo4j = require('neo4j-driver').v1;
var driver =
    neo4j.driver("bolt://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24786",
    neo4j.auth.basic("admin", "b.gj4kU3HhDiFG.hhoE5SZipR0xvYXl"));

routes.get('/games', function(req, res){
   var session = driver.session();
   session
       .run("MATCH (g:Game) RETURN g")
       .then(function(result) {
           result.records.forEach(function(record){
               console.log(record)
           });
           var resultObject = JSON.parse(result);
           res.status(200).json(resultObject.properties);
           session.close();
       })
       .catch(function(error){
           console.log("Error: " + error);
           res.status(418).json(error);
       })
});

module.exports = routes;