'use strict';

var _ = require('lodash'),
    q = require('q'),
    getTimeSeriesForResource = require('./get-time-series-for-resource'),
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
    return q.all(_.map(resources, function(subCategory, category) {
        return getTimeSeriesForResource(app, user, '2013-12-01', '7d', category, subCategory);
    })).then(function(timeSeriesPerResource) {
        return _.merge.apply(_, [{}].concat(timeSeriesPerResource));
    });
}

module.exports = getTimeSeries;
