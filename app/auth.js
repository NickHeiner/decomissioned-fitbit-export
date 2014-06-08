'use strict';

var passport = require('passport'),
    getConfig = require('./get-config'),
    url = require('url'),
    connect = require('connect'),
    FitbitStrategy = require('passport-fitbit').Strategy,
    callbackPath = '/auth/fitbit/callback';

function auth(app) {
    var config = getConfig(app),
        callbackUrl;

    app.use(connect.cookieParser('this is a random string for the cookie parser'));
    app.use(connect.session());
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/fitbit', passport.authenticate('fitbit'));
    app.get(
        callbackPath,
        passport.authenticate('fitbit', { failureRedirect: '/?error=auth_failed' }),
        function(req, res) {
            res.redirect('/');
        }
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    callbackUrl = url.format({
        protocol: 'http',
        host: config.host,
        port: config.port,
        pathname: callbackPath
    });

    passport.use(new FitbitStrategy({
        consumerKey: config.fitbitClientKey,
        consumerSecret: config.fitbitClientSecret,
        callbackUrl: callbackUrl
    }, function(token, tokenSecret, profile, done) {
        console.log('auth', arguments);
    }));
}

module.exports = auth;
