'use strict';

var express = require('express'),
    app = express(),
    path = require('path'),
    morgan = require('morgan'),
    getConfig = require('./get-config'),
    auth = require('./auth'),
    _ = require('lodash'),
    server;

app.use(morgan());

app.get('/', function(req, res){
    res.render('index.ejs', {
        loggedIn: req.session && req.session.passport && req.session.passport.user.id
    });
});

// https://github.com/visionmedia/express/pull/2165
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', require('ejs'));

auth(app);

server = app.listen(getConfig(app).port, function() {
    console.log(require('../package').name + ' express app listening at', server.address());
});
