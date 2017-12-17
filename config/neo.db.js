var neo4j = require('neo4j-driver').v1;
const neo = require('./env/env').neo;

var driver =
    neo4j.driver(neo.url,
        neo4j.auth.basic(neo.user, neo.password));

module.exports = driver;