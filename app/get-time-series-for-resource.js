'use strict';

var q = require('q'),
    getConfig = require('./get-config'),
    transformFitbitResponse = require('./transform-fitbit-response'),
    url = require('url'),
    _ = require('lodash'),
    OAuth = require('oauth');

function getTimeSeries(app, user, baseDate, period, resourceCategory, resourceSubcategory) {

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
        deferred = q.defer(),
        requestUrl = url.format({
            protocol: 'https',
            hostname: 'api.fitbit.com',
            pathname: _.template('/1/user/-/<%= resourceCategory %>/<%= resourceSubcategory %>/date/<%= baseDate %>/<%= period %>.json', {
                resourceCategory: resourceCategory,
                resourceSubcategory: resourceSubcategory,
                baseDate: baseDate,
                period: period
            })
        });

    console.log('Requesting data url', requestUrl);

    // I wanted to use q.ninvoke here but it didn't work for whatever reason.
    oauth.get(
        requestUrl,
        user.token,
        user.tokenSecret,
        function(err, data) {
            if (err) {
                // If this specific field complains, no need to bomb out the entire request;
                // we'll just say we didn't get anything
                if (err.statusCode === 400) {
                    console.log('request url ' + requestUrl + ' for user ' + user.id + 'resulted in a 400');
                    deferred.resolve([]);
                    return;
                }
                deferred.reject(err);
                return;
            }

            deferred.resolve(transformFitbitResponse(JSON.parse(data)));
        }
    );

    return deferred.promise;
}

module.exports = getTimeSeries;
