/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
    /**
     * Array of application names.
     */
    app_name : ['fitbit-export'],
    /**
     * Your New Relic license key.
     */
    license_key : '36f1ecc36f5d6e98fcc4c8128aa37fdef6d83122',
    logging : {
        /**
         * Level at which to log. 'trace' is most useful to New Relic when diagnosing
         * issues with the agent, 'info' and higher will impose the least overhead on
         * production applications.
         */
        level : 'info'
    }
};
