'use strict';

var express = require('express'),
    app = express(),
    path = require('path'),
    morgan = require('morgan'),
    connect = require('connect'),
    q = require('q'),
    getTimeSeries = require('./get-time-series'),
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
    var userPath = ['session', 'passport', 'user'],
        traverseReq = traverse(req),
        userExists = traverseReq.has(userPath),
        user = userExists && traverseReq.get(userPath),
        timeSeriesPromise = userExists ? getTimeSeries(user) : q([]);

    timeSeriesPromise.then(function(timeSeries) {
        // We will assume that every entry in timeSeries has the same keys.
        var timeSeriesKeys = _.keys(_.first(timeSeries));

        res.render('index.ejs', {
            user: user,
            timeSeries: timeSeries,
            timeSeriesKeys: timeSeriesKeys
        });
    });
});

// https://github.com/visionmedia/express/pull/2165
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', require('ejs'));

auth(app);

server = app.listen(getConfig(app).port, function() {
    console.log(require('../package').name + ' express app listening at', server.address());
});
