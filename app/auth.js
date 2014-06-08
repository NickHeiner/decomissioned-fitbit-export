'use strict';

var passport = require('passport'),
    getConfig = require('./get-config'),
    url = require('url'),
    FitbitStrategy = require('passport-fitbit').Strategy,
    callbackPath = '/auth/fitbit/callback';

function auth(app) {
    var config = getConfig(app),
        callbackUrl;

    app.get('/auth/fitbit', passport.authenticate('fitbit'));
    app.get(
        callbackPath,
        passport.authenticate('fitbit', { failureRedirect: '/?error=auth_failed' }),
        function(req, res) {
//            console.log('req.user', req.user);
//            res.json(req.user);
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
        console.log('Logged in user ', profile.id, ' with display name ', profile.displayName);
        done(null, profile);
    }));
}

module.exports = auth;
