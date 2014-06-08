'use strict';

var getTimeSeriesForResource = require('./get-time-series-for-resource');

function getTimeSeries(app, user) {
    return getTimeSeriesForResource(app, user, '2013-12-01', '7d', 'activites', 'distance');
}

module.exports = getTimeSeries;
