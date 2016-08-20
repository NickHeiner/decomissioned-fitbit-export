'use strict';

var passport = require('passport'),
    getConfig = require('./get-config'),
    url = require('url'),
    logger = require('./logger'),
    FitbitOAuth2Strategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;

function auth(app) {
    var config = getConfig(app);

    const callbackPath = '/auth/fitbit/callback';

    app.get('/auth/fitbit', passport.authenticate('fitbit', { scope: ['activity', 'profile']}));
    app.get(
        callbackPath,
        passport.authenticate('fitbit', { 
            successRedirect: '/',
            failureRedirect: '/auth-error'
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    const callbackUrl = url.format({
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
        logger.info({profileId: profile.id, profileDisplayName: profile.displayName}, 'Logged in user');

        profile.token = token;
        profile.tokenSecret = tokenSecret;

        done(null, profile);
    }));
}

module.exports = auth;
