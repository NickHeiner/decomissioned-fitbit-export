'use strict';

require('newrelic');

var express = require('express'),
    app = express(),
    path = require('path'),
    morgan = require('morgan'),
    connect = require('connect'),
    traverse = require('traverse'),
    passport = require('passport'),
    getConfig = require('./get-config'),
    _ = require('lodash'),
    exportCsv = _.curry(require('./export-csv'))(app),
    auth = require('./auth'),
    server;

app.use(morgan());

app.use(connect.cookieParser());
app.use(connect.session({secret: getConfig(app).sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
    var userPath = ['session', 'passport', 'user'],
        traverseReq = traverse(req),
        userExists = traverseReq.has(userPath),
        user = userExists && traverseReq.get(userPath);

    res.render('index.ejs', {
        user: user
    });
});

app.get('/diagnostics.json', function(req, res) {
    res.json({
        nodeJsVersion: process.version
    });
});

app.get('/export.csv', exportCsv);

// https://github.com/visionmedia/express/pull/2165
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', require('ejs'));

auth(app);

server = app.listen(getConfig(app).port, function() {
    console.log(require('../package').name + ' express app listening at', server.address());
});
