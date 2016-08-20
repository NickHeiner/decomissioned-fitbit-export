'use strict';

const bunyan = require('bunyan'),
    _ = require('lodash'),
    bunyanFormat = require('bunyan-format')();

const logger = bunyan.createLogger({
    name: require('../package').name,
    level: process.env.loglevel || 'info',
    stream: bunyanFormat
});

module.exports = logger;

module.exports.logStep = function(rawOpts, fn) {
    const opts = _.merge({
        level: 'info'
    }, rawOpts),
        logOpts = _.omit(opts, 'info', 'step'); 

    logger[opts.level](opts, `Starting ${opts.step}`);
    return fn().then(res => {
        logger[opts.level](opts, `Finished ${opts.step}`);
        return res;
    });
};
