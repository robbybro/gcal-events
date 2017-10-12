const _ = require('underscore');
const axios = require('axios');
const expect = require('expect');
const MockAdapter = require('axios-mock-adapter');
const googleCal = require('../index.js');
const secrets = require('../secrets.js');
const res = {
    items: [
        {
            "summary": "Event 1 (way in the past)",
            "location": "Seattle, WA 98109, USA",
            "extrafield": "foo",
            "start": {
                "dateTime": "1991-10-01T10:30:00-07:00",
                "timeZone": "America/Los_Angeles"
            },
            "end": {
                "dateTime": "1991-10-01T11:45:00-07:00",
                "timeZone": "America/Los_Angeles"
            }
        },
        {
            "summary": "Event 2",
            "location": "Seattle, WA 98109, USA",
            "extrafield": "foo",
            "start": {
                "dateTime": "2017-10-01T10:30:00-07:00",
                "timeZone": "America/Los_Angeles"
            },
            "end": {
                "dateTime": "2017-10-01T11:45:00-07:00",
                "timeZone": "America/Los_Angeles"
            }
        },
        {
            "summary": "Event 3",
            "location": "Seattle, WA 98109, USA",
            "extrafield": "foo",
            "start": {
                "dateTime": "2017-10-01T10:30:00-07:00",
                "timeZone": "America/Los_Angeles"
            },
            "end": {
                "dateTime": "2017-10-01T11:45:00-07:00",
                "timeZone": "America/Los_Angeles"
            }
        },
        {
            "summary": "Event 4 (way in the future)",
            "location": "Seattle, WA 98109, USA",
            "extrafield": "foo",
            "start": {
                "dateTime": "2447-07-06T06:00:00.000Z",
                "timeZone": "America/Los_Angeles"
            },
            "end": {
                "dateTime": "2447-07-06T07:00:00.000Z",
                "timeZone": "America/Los_Angeles"
            }
        },
    ]
};

const mock = new MockAdapter(axios);
const apiUrl = encodeURI(
    'https://www.googleapis.com/calendar/v3/calendars/' +
    secrets.calendarId +
    '/events?singleEvents=true&orderBy=startTime&key=' +
    secrets.apiKey
);
mock.onGet(apiUrl).reply(200, res);

// pretend today is Oct 1, 2017
let start = new Date('2017-10-01T00:00:00-07:00');
let end = new Date('2017-10-01T00:00:00-07:00');
// pretend we want 2 weeks of events (everything up to Oct 15, 2017)
end.setDate(end.getDate() + 14);

let options = {
    whitelist: [
        'start',
        'end',
        'location',
        'summary'
    ],
    count: 5,
    start: start,
    end: end,
    apiKey: secrets.apiKey,
    calendarId: secrets.calendarId
};

googleCal.getEvents(options).then(events => {
    expect(events.length).toEqual(2);
    expect(Object.keys(events[0]).sort()).toEqual(options.whitelist.sort());
    options.start = new Date(0);
    options.end = new Date('2447-07-07T07:00:00.000Z');
    options.whitelist.push('extrafield');
    googleCal.getEvents(options).then(events => {
        expect(events.length).toEqual(4);
        expect(Object.keys(events[0]).sort()).toEqual(options.whitelist.sort());
        options.count = 1;
        googleCal.getEvents(options).then(events => {
            expect(events.length).toEqual(1);
        });
    });
});