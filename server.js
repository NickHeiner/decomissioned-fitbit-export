'use strict';

var express = require('express'),
    app = express(),
    getConfig = require('./app/get-config'),
    auth = require('./app/auth'),
    _ = require('lodash'),
    server;

app.get('/', function(req, res){
    res.render('../views/index.ejs', {
        loggedIn: req.session && req.session.passport && req.session.passport.user.id
    });
});

app.set('view engine', require('ejs'));

auth(app);

server = app.listen(getConfig(app).port, function() {
    console.log('Listening on port %d', server.address().port);
});
