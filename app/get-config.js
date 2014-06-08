'use strict';

var configMap = Object.freeze({
    production: {
        fitbitClientKey: process.env.FITBIT_DATA_EXPORT_CLIENT_KEY,
            fitbitClientSecret: process.env.FITBIT_DATA_EXPORT_CLIENT_SECRET,
            host: 'TODO',
            port: 3001
    },
    development: {
        fitbitClientKey: process.env.FITBIT_DATA_EXPORT_CLIENT_KEY,
            fitbitClientSecret: process.env.FITBIT_DATA_EXPORT_CLIENT_SECRET,
            host: 'localhost',
            port: 3001
    }
});

function getConfig(app) {
    return configMap[app.get('env')];
}

module.exports = getConfig;


