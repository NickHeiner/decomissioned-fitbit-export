'use strict';

// This is copied from elsewhere in this project wooo.

const bunyan = require('bunyan'),
  _ = require('lodash'),
  bunyanFormat = require('bunyan-format')();

const logger = bunyan.createLogger({
  name: require('./package').name,
  level: process.env.loglevel || 'info',
  stream: bunyanFormat
});

module.exports = logger;

module.exports.logStep = function(rawOpts, fn) {
  const opts = _.merge({
      level: 'info'
    }, rawOpts),
    logOpts = _.omit(opts, ['level', 'step']);

  logger[opts.level](logOpts, `Starting ${opts.step}`);

  const startTime = new Date();
  const extraOpts = {};
  return fn(extraOpts).then(res => {
    const finishedTime = new Date();
    logger[opts.level](
      _.merge({}, logOpts, {durationMs: finishedTime - startTime}, extraOpts),
      `Finished ${opts.step}`
    );
    return res;
  });
};
