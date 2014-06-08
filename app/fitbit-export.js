'use strict';

var express = require('express'),
    app = express(),
    getConfig = require('./get-config'),
    auth = require('./auth'),
    _ = require('lodash'),
    server;

app.get('/', function(req, res){
    res.render('index.ejs', {
        loggedIn: req.session && req.session.passport && req.session.passport.user.id
    });
});

app.set('view engine', require('ejs'));

auth(app);

server = app.listen(getConfig(app).port, function() {
    console.log(require('../package').name + ' express app listening on port %d', server.address().port);
});
