'use strict';

var _ = require('lodash'),
    q = require('q'),
    traverse = require('traverse'),
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

function getTimeSeries(app, user, rawOpts) {

    var opts = _.merge({
            baseDate: '2014-06-08',
            timePeriod: '7d'
        }, rawOpts),
        resourcePromises = _(resources)
            .map(function(subCategories, category) {
                return _.map(subCategories, function(subCategory) {
                    return getTimeSeriesForResource(app, user, opts.baseDate, opts.timePeriod, category, subCategory);
                });
            })
            .flatten()
            .first(opts.limitKeys)
            .valueOf();

    console.log('promises', resourcePromises);

    return q.all(resourcePromises).then(function(timeSeriesPerResource) {
        console.log('tspr', timeSeriesPerResource);
        return combineFitbitResponses(_.flatten(timeSeriesPerResource));
    });
}

module.exports = getTimeSeries;
