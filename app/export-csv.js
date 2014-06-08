'use strict';

var getTimeSeries = require('./get-time-series'),
    q = require('q'),
    _ = require('lodash'),
    qJson2csv = q.denodeify(require('json2csv'));

function exportCsv(app, req, res) {
    if (!req.session.passport.user) {
        res.redirect('/');
        return;
    }

    getTimeSeries(app, req.session.passport.user).then(function(timeSeries) {
        // assume that all entries have the same keys
        var keys = _.keys(_.first(timeSeries));
        return qJson2csv({data: timeSeries, fields: keys});
    }).then(function(csv) {
        res.send(csv);
    }).fail(function(err) {
        res.send('Could not get data from fitbit. This could be an error in this app or in fitbit itself. If you have' +
            'not logged in for a while, you could try logging to this app again. Error: ' + JSON.stringify(err));
    });
}

module.exports = exportCsv;
