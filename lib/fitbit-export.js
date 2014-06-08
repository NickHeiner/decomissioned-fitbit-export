'use strict';

var express = require('express'),
    app = express(),
    server;

app.get('/', function(req, res){
    res.render('../views/index.ejs');
});

app.set('view engine', require('ejs'));

server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
