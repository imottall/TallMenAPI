var express = require('express');
var routes = express.Router();
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24786", neo4j.auth.basic("admin", "b.gj4kU3HhDiFG.hhoE5SZipR0xvYXl"));
var session = driver.session();


routes.get('/neo/users', function(req, res) {
    session
        .run("MATCH (n) RETURN n")
        .then(function(result) {
            result.records.forEach(function(record) {
                console.log(JSON.stringify(record, null, 4))
            });
            session.close();
        })
        .catch(function(error) {
            console.log(error);
        });
});

routes.post('/neo/newuser', function(req, res) {
    session
        .run("CREATE (n:Person {name:'Bob'}) RETURN n.name")
        .then(function(result) {
            result.records.forEach(function(record) {
                console.log(record)
            });

            session.close();
        })
        .catch(function(error) {
            console.log(error);
        });
});

module.exports = routes;