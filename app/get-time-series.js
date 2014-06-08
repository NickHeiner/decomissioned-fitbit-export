'use strict';

var q = require('q');

function getTimeSeries() {
    return q([
        {
            "dateTime": "2013-11-25",
            "distance": "2.41932"
        }
    ])
}

module.exports = getTimeSeries;
