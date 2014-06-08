'use strict';

var q = require('q'),
    getConfig = require('./get-config'),
    OAuth = require('oauth');

function getTimeSeries(app, user) {

    var config = getConfig(app),
        oauth = new OAuth.OAuth(
            'https://api.fitbit.com/oauth/request_token',
            'https://api.fitbit.com/oauth/access_token',
            config.fitbitClientKey,
            config.fitbitClientSecret,
            '1.0',
            null,
            'HMAC-SHA1'
        ),
        deferred = q.defer();

    // I wanted to use q.ninvoke here but it didn't work for whatever reason.
    oauth.get(
        'http://api.fitbit.com/1/user/-/activities/distance/date/2013-12-01/7d.json',
        user.token,
        user.tokenSecret,
        function(err, data) {
            var jsonData;

            if (err) {
                deferred.reject(err);
            }

            var jsonData = JSON.parse(data);

            deferred.resolve(jsonData['activities-distance']);
        }
    );

    return deferred.promise;
}

module.exports = getTimeSeries;
