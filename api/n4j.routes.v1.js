var express = require('express');
var routes = express.Router();
//var neo4j = require('neo4j');
//var db = new neo4j.GraphDatabase("https://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24780");
var neo4j = require('neo4j-driver').v1;
var driver =
    neo4j.driver("bolt://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24786",
    neo4j.auth.basic("admin", "b.gj4kU3HhDiFG.hhoE5SZipR0xvYXl"));

routes.get('/neousers', function(req, res) {
    /*db.cypher({
        query: 'CREATE (n:Person {name: {personName}}) RETURN n',
        params: {
            personName: 'Bob'
        }
    }, function(err, results){
        var result = results[0];
        if (err) {
            console.error('Error saving new node to database:', err);
        } else {
            console.log('Node saved to database with id:', result['n']['_id']);
        }
    });*/
    var session = driver.session();
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