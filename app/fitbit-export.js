'use strict';

require('newrelic');

const express = require('express'),
    app = express(),
    path = require('path'),
    getConfig = require('./get-config'),
    moment = require('moment'),
    _ = require('lodash'),
    _inRange = require('lodash.inrange'),
    appVersion = require('../package').version,
    bunyanMiddleware = require('bunyan-middleware'),
    logger = require('./logger');

// This is more verbose than I'd like but w/e
app.use(bunyanMiddleware({
    logger,
    logName: 'reqId'
}));

app.get('/', function(req, res, next) {
    res.render('index.ejs');
});

app.get('/diagnostics.json', function(req, res) {
    res.json({
        appVersion, 
        nodeJsVersion: process.version
    });
});

app.get('/static/autotrack.js', function(req, res) {
    res.sendFile(
        require.resolve('autotrack/autotrack.js'),

        // This is a shit way to do caching, but since the site is fairly low
        // traffic, hopefully this will allow repeat page views to be faster,
        // without causing a ton of issues when I do a deploy.
        {maxAge: moment.duration(10, 'minutes').asMilliseconds()}
    );
});

// On Azure Nodejs, we can't rely on process.cwd() being
// the root directory of this project. Instead, we'll explicitly
// provide the path.
app.use('/static', express.static(path.join(__dirname, '..', 'static')));

app.use((err, req, res, next) => {
    if (err) {
        res.status(500);
        res.render('error.ejs', {err, isFitbitProblem: _inRange(err.statusCode, 500, 600)});
    }
});

// https://github.com/visionmedia/express/pull/2165
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', require('ejs'));

const server = app.listen(getConfig(app).port, function() {
    logger.info({address: server.address()}, 'App listening');
});
