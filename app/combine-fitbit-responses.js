'use strict';

var _ = require('lodash');

function combineFitbitResponses(responses) {
    return _(responses)
        .groupBy('dateTime')
        .map(function(el) {
            return _.merge.apply(_, [{}].concat(el));
        })
        .valueOf();
}

module.exports = combineFitbitResponses;
