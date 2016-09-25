'use strict';

require('newrelic');

const express = require('express'),
    app = express(),
    path = require('path'),
    connect = require('connect'),
    traverse = require('traverse'),
    passport = require('passport'),
    getConfig = require('./get-config'),
    moment = require('moment'),
    _ = require('lodash'),
    _inRange = require('lodash.inrange'),
    exportCsv = _.curry(require('./export-csv'))(app),
    auth = require('./auth'),
    appVersion = require('../package').version,
    bunyanMiddleware = require('bunyan-middleware'),
    logger = require('./logger');

// This is more verbose than I'd like but w/e
app.use(bunyanMiddleware({
    logger,
    logName: 'reqId'
}));

app.use(connect.cookieParser());
app.use(connect.session({secret: getConfig(app).sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res, next) {
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

app.get('/export.csv', exportCsv);

app.get('/auth-error', (req, res) => {
    res.status(500);
    res.render('error.ejs', {err: new Error('Authenticating with FitBit failed.')});
});

app.use((err, req, res, next) => {
    if (err) {
        res.status(500);
        res.render('error.ejs', {err, isFitbitProblem: _inRange(err.statusCode, 500, 600)});
    }
});

// https://github.com/visionmedia/express/pull/2165
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', require('ejs'));

auth(app);

const server = app.listen(getConfig(app).port, function() {
    logger.info({address: server.address()}, 'App listening');
});
