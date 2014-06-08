'use strict';

var express = require('express'),
    app = express(),
    path = require('path'),
    morgan = require('morgan'),
    connect = require('connect'),
    traverse = require('traverse'),
    passport = require('passport'),
    getConfig = require('./get-config'),
    auth = require('./auth'),
    _ = require('lodash'),
    server;

app.use(morgan());

app.use(connect.cookieParser());
app.use(connect.session({secret: getConfig(app).sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
    console.log('session', req.session);
    var userExists = traverse(req).has(['session', 'passport', 'user']);
    res.render('index.ejs', {
        user: userExists && req.session.passport.user
    });
});

// https://github.com/visionmedia/express/pull/2165
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', require('ejs'));

auth(app);

server = app.listen(getConfig(app).port, function() {
    console.log(require('../package').name + ' express app listening at', server.address());
});
