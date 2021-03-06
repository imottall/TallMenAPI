//
// server.js
//
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var gamesroutes = require('./api/games.routes');
var forumsroutes = require('./api/forums.routes');
var accountsroutes = require('./api/account.routes');
var config = require('./config/env/env');
var app = express();

module.exports = {};

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.set('port', (process.env.PORT | config.env.webPort));
app.set('env', (process.env.ENV | 'development'));

app.use(logger('dev'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('', forumsroutes);
app.use('', gamesroutes);
app.use('', accountsroutes);

app.use(function (err, req, res, next) {
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    };
    res.status(401).send(error);
});

app.use('*', function (req, res) {
    res.status(400);
    res.json({
        'error': 'Deze URL is niet beschikbaar.'
    });
});

app.listen(config.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));
});

module.exports = app;