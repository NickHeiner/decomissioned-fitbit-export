'use strict';

var _ = require('lodash'),
    q = require('q'),
    getTimeSeriesForResource = require('./get-time-series-for-resource'),
    combineFitbitResponses = require('./combine-fitbit-responses'),
    resources = Object.freeze({
        foods: [
            'log/caloriesIn',
            'log/water'
        ],
        activities: [
            'calories',
            'caloriesBMR',
            'steps',
            'distance',
            'floors',
            'elevation',
            'minutesSedentary',
            'minutesLightlyActive',
            'minutesFairlyActive',
            'minutesVeryActive',
            'activityCalories',
        ],
        sleep: [
            'startTime',
            'timeInBed',
            'minutesAsleep',
            'awakeningsCount',
            'minutesAwake',
            'minutesToFallAsleep',
            'minutesAfterWakeup',
            'efficiency',
        ],
        body: [
            'weight',
            'bmi',
            'fat',
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

        console.log('timeSeriesPerResource', timeSeriesPerResource, 'combined', combineFitbitResponses(timeSeriesPerResource));

        return combineFitbitResponses(_.flatten(timeSeriesPerResource));
    });
}

module.exports = getTimeSeries;
