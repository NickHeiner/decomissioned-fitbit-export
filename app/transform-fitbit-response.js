'use strict';

var _ = require('lodash'),
    traverse = require('traverse');

function newObj(key, val) {
    var obj = {};
    obj[key] = val;
    return obj;
}

function transformFitbitResponse(response) {
    var rekeyed = traverse(response).reduce(function(acc, node) {

        var nodeWithoutValue = _.omit(node, 'value');

        if (_.has(node, 'value')) {

            var withNewKey = _.merge({}, nodeWithoutValue, newObj(
                this.path[0], node.value
            ));

            return acc.concat(withNewKey);
        }

        return acc;
    }, []);

    return rekeyed;
}

module.exports = transformFitbitResponse;
