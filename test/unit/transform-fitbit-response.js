'use strict';

var expect = require('chai').expect,
    transformFitbitResponse = require('../../app/transform-fitbit-response');

describe('transform-fitbit-response', function() {

    it('transforms the response', function() {
        var response = {
            'activities-distance': [
                {
                    dateTime: '2013-11-25',
                    value: 2.419
                },
                {
                    dateTime: '2013-11-26',
                    value: 4.83
                }
            ]
        };

        expect(transformFitbitResponse(response)).to.deep.equal([
            {
                dateTime: '2013-11-25',
                'activities-distance': 2.419
            },
            {
                dateTime: '2013-11-26',
                'activities-distance': 4.83
            }
        ]);
    });

});
