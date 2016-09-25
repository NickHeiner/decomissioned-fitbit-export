'use strict';

const q = require('q'),
    getConfig = require('./get-config'),
    transformFitbitResponse = require('./transform-fitbit-response'),
    url = require('url'),
    _ = require('lodash'),
    logger = require('./logger'),
    logStep = logger.logStep,
    got = require('got');

function getTimeSeries(app, user, baseDate, period, resourceCategory, resourceSubcategory) {
    const config = getConfig(app),
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

    return logStep({step: 'requesting data url', requestUrl}, () => 
        got(requestUrl, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then(res => transformFitbitResponse(JSON.parse(res.body)))
            .catch(err => {
                // If this specific field complains, no need to bomb out the entire request;
                // we'll just say we didn't get anything
                if (err.statusCode === 400) {
                    logger.warn({requestUrl, userId: user.id}, 'Request resulted in a 400');
                    return [];
                }
                err.requestUrl = requestUrl;
                err.responseBody = err.response.body;
                logger.error({err, errData: err}, 'Fitbit API request failed.');
                throw err;
            })
    );
}

module.exports = getTimeSeries;
