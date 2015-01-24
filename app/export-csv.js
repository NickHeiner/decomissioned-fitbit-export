'use strict';

var _ = require('lodash'),
    storage = require('./storage');

function exportCsv(req, res) {
    if (!req.session.passport.user) {
        res.redirect('/');
        return;
    }

    storage.addUser(req.session.passport.user).then(function() {
        res.send('Export started for ' + req.session.passport.user);
    }).fail(function(err) {
        res.status(500).send('Could not start export: ' + JSON.stringify(err));
    });
}

module.exports = exportCsv;
