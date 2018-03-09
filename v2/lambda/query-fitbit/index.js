/* eslint-disable no-console */

const url = require('url'),
  logger = require('./logger'),
  logStep = logger.logStep,
  got = require('got');

exports.handler = ({accessToken, baseDate, period, resourceCategory, resourceSubcategory}) => {
  const requestUrl = url.format({
    protocol: 'https',
    hostname: 'api.fitbit.com',
    pathname: `/1/user/-/${resourceCategory}/${resourceSubcategory}/date/${baseDate}/${period}.json`
  });

  return logStep({step: 'requesting data url', requestUrl}, extraOpts =>
    got(requestUrl, {
      json: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => {
        extraOpts.resBody = res.body;
        return res.body;
      })
      .catch(err => {
        err.requestUrl = requestUrl;
        err.responseBody = err.response.body;
        logger.error({err, errData: err}, 'Fitbit API request failed.');
        throw err;
      })
  );
};
