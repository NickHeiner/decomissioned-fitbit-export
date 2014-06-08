'use strict';

var _ = require('lodash'),
    q = require('q'),
    getTimeSeriesForResource = require('./get-time-series-for-resource'),
    combineFitbitResponses = require('./combine-fitbit-responses'),
    resources = Object.freeze({
        activities: [
            'distance',
            'calories',
            'minutesSedentary'
        ],
        sleep: [
            'startTime',
            'timeInBed'
        ]
    });

function getTimeSeries(app, user) {

    var resourcePromises = _(resources)
            .map(function(subCategories, category) {
                return _.map(subCategories, function(subCategory) {
                    return getTimeSeriesForResource(app, user, '2013-12-01', '7d', category, subCategory);
                });
            })
            .flatten()
            .valueOf();

    return q.all(resourcePromises).then(function(timeSeriesPerResource) {
        return combineFitbitResponses(timeSeriesPerResource);
    });
}

module.exports = getTimeSeries;
