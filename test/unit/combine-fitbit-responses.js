'use strict';

var expect = require('chai').expect,
    combineFitbitResponses = require('../../app/combine-fitbit-responses');

describe('combine-fitbit-responses', function() {

    it('combines the responses', function() {
        var responses = [
            {
                dateTime: '2013-11-25',
                'activities-distance': 2.419
            },
            {
                dateTime: '2013-11-26',
                'activities-distance': 4.83
            },
            {
                dateTime: '2013-11-25',
                'sleep-timeInBed': 480
            },
            {
                dateTime: '2013-12-01',
                'body-weight': 152
            },
            {
                dateTime: '2013-12-01',
                'sleep-timeInBed': 212
            }
        ];

        expect(combineFitbitResponses(responses)).to.deep.equal([
            {
                dateTime: '2013-11-25',
                'activities-distance': 2.419,
                'sleep-timeInBed': 480
            },
            {
                dateTime: '2013-11-26',
                'activities-distance': 4.83
            },
            {
                dateTime: '2013-12-01',
                'body-weight': 152,
                'sleep-timeInBed': 212
            }
        ]);
    });

});
