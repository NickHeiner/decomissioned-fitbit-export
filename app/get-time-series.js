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

            // This endpoint is bombing out for some reason.
            // https://community.fitbit.com/t5/Web-API/504-Error-Code-for-activityCalories/m-p/1579598#M6393
            // 'activityCalories',
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
            baseDate: 'today',
            timePeriod: 'max'
        }, rawOpts),

        resourcePromises = _(resources)
            .map(function(subCategories, category) {
                return _.map(subCategories, function(subCategory) {
                    return getTimeSeriesForResource(app, user, opts.baseDate, opts.timePeriod, category, subCategory);
                });
            })
            .flatten()
            .valueOf();

    return q.all(resourcePromises).then(function(timeSeriesPerResource) {
        return combineFitbitResponses(_.flatten(timeSeriesPerResource));
    });
}

module.exports = getTimeSeries;
