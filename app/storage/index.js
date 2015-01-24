'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    q = require('q'),
    // TODO move this to get-config.js and validate that the env vars exist.
    connectionString = _.template(
        'mongodb://<%= dbuser %>:<%= dbpassword %>@ds060977.mongolab.com:60977/fitbit-export', {
            dbuser: process.env.MONGOLAB_FITBIT_DB_USERNAME,
            dbpassword: process.env.MONGOLAB_FITBIT_DB_PASSWORD
        }),
    userSchema = new mongoose.Schema({
        userId: String
    }),
    userModel = mongoose.model('User', userSchema),
    resourceResponseSchema = new mongoose.Schema({
        userId: String,
        category: String,
        subcategory: String,
        response: String
    }),
    resourceResponseModel = mongoose.model('ResourceResponse', resourceResponseSchema);

resourceResponseSchema.virtual('responseJson').get(function() {
    return JSON.parse(this.response);
});

mongoose.connect(connectionString);

module.exports = {
    addUser: addUser
};

function addUser(userId) {
    return q.ninvoke(userModel, 'create', {userId: userId});
}
