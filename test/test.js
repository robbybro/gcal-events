const _ = require('underscore');
const axios = require('axios');
const jasmine  = require('assert');
const MockAdapter = require('axios-mock-adapter');
const googleCal = require('../index.js');
const secrets = require('../src/secrets.js');
const res = require('./events.js');

// set up mock api
const mock = new MockAdapter(axios);
const apiUrl = encodeURI(
    'https://www.googleapis.com/calendar/v3/calendars/' +
    secrets.calendarId +
    '/events?singleEvents=true&orderBy=startTime&key=' +
    secrets.apiKey
);
mock.onGet(apiUrl).reply(200, res);

let options =  {};
beforeEach(function() {
    options = {
        whitelist: [
            'start',
            'end',
            'location',
            'summary'
        ],
        count: 5,
        start: 0,
        end: 0,
        apiKey: secrets.apiKey,
        calendarId: secrets.calendarId
    };
    
})
describe('Google Calendar Events', function() {
    it('gets events in the next 2 weeks', function() {
        // pretend today is Oct 1, 2017
        options.start = new Date('2017-10-01T00:00:00-07:00');
        options.end = new Date('2017-10-01T00:00:00-07:00');
        // pretend we want 2 weeks of events (everything up to Oct 15, 2017)
        options.end.setDate(options.end.getDate() + 14);
  
        googleCal.getEvents(options).then(events => {
                assert.equal(events.length, 2);
                assert.equal(
                    Object.keys(events[0]).sort(),
                    options.whitelist.sort()
                );
        });
    });
    it('gets events over a long period of time', function() {
        googleCal.getEvents(options).then(events => {
            options.start = new Date(0);
            options.end = new Date('2447-07-07T07:00:00.000Z');
            options.whitelist.push('extrafield');
            assert.equal(events.length, 4);
        });
    });
    it('returns events with specific fields whitelisted', function() {
        googleCal.getEvents(options).then(events => {
            assert.equal(
                Object.keys(events[0]).sort(),
                options.whitelist.sort()
            );
        });            
    });
    it('gets a specific number of events', function() {        
        options.count = 1;        
        googleCal.getEvents(options).then(events => {
            assert.equal(events.length, 1);
        });
    })
});