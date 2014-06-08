'use strict';

var express = require('express'),
    app = express(),
    getConfig = require('./get-config'),
    auth = require('./auth'),
    server;

app.get('/', function(req, res){
    res.render('../views/index.ejs');
});

app.set('view engine', require('ejs'));

auth(app);

server = app.listen(getConfig(app).port, function() {
    console.log('Listening on port %d', server.address().port);
});
