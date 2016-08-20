'use strict';

const bunyan = require('bunyan'),
    bunyanFormat = require('bunyan-format')();

module.exports = bunyan.createLogger({
    name: require('../package').name,
    level: process.env.loglevel || 'info',
    stream: bunyanFormat
});
