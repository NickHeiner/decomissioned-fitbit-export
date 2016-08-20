'use strict';

var passport = require('passport'),
    getConfig = require('./get-config'),
    url = require('url'),
    FitbitOAuth2Strategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy,
    callbackPath = '/auth/fitbit/callback';

function auth(app) {
    var config = getConfig(app),
        callbackUrl;

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

    passport.use(new FitbitOAuth2Strategy({
        clientID: config.fitbitClientKey,
        clientSecret: config.fitbitClientSecret,
        callbackUrl: callbackUrl
    }, function(token, tokenSecret, profile, done) {
        console.log('Logged in user ', profile.id, ' with display name ', profile.displayName);

        profile.token = token;
        profile.tokenSecret = tokenSecret;

        done(null, profile);
    }));
}

module.exports = auth;
