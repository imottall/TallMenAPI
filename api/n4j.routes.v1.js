var express = require('express');
var routes = express.Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase("https://hobby-npihgclecffdgbkehgonlial.dbs.graphenedb.com:24780");


routes.get('/neo/users', function(req, res) {
    db.cypher({
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
    });
});

module.exports = routes;