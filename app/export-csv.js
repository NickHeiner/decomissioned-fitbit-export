'use strict';

var getTimeSeries = require('./get-time-series'),
    q = require('q'),
    _ = require('lodash'),
    json2csv = require('json2csv');

function exportCsv(app, req, res, next) {
    if (!req.user) {
        res.redirect('/');
        return;
    }

    getTimeSeries(app, req.user).then(function(timeSeries) {
        // assume that all entries have the same keys
        var keys = _.keys(_.first(timeSeries));
        res.send(json2csv({data: timeSeries, fields: keys}));
    }).fail(next);
}

module.exports = exportCsv;
