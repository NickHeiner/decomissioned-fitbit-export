'use strict';

var q = require('q'),
    getConfig = require('./get-config'),
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
            protocol: 'http',
            hostname: 'api.fitbit.com',
            pathname: _.template('/1/user/-/<%= resourceCategory %>/<%= resourceSubcategory %>/date/<%= baseDate %>/<% period %>.json', {
                resourceCategory: resourceCategory,
                resourceSubcategory: resourceSubcategory,
                baseDate: baseDate,
                period: period
            })
        });

    // I wanted to use q.ninvoke here but it didn't work for whatever reason.
    oauth.get(
        requestUrl,
        user.token,
        user.tokenSecret,
        function(err, data) {
            var jsonData,
                responseKey = [resourceCategory, resourceSubcategory].join('-');

            if (err) {
                deferred.reject(err);
                return;
            }

            jsonData = JSON.parse(data);

            deferred.resolve(jsonData[responseKey]);
        }
    );

    return deferred.promise;
}

module.exports = getTimeSeries;
