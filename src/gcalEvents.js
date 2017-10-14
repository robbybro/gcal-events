'use strict';

const axios = require('axios');
const _ = require('underscore');

function getEvents(options) {
    if (!options.calendarId) {
        throw 'Please add a calendar ID';
    }
    if (!options.apiKey) {
        throw 'Please add an API Key';
    }
    const apiUrl = encodeURI(
        'https://www.googleapis.com/calendar/v3/calendars/' +
        options.calendarId +
        '/events?singleEvents=true&orderBy=startTime&key=' +
        options.apiKey
    );

    return  axios.get(apiUrl)
        .then(res => {
            let events = res.data.items;
            let now  = new Date();
            if (options.whitelist && options.whitelist.length > 0) {
                let eventKeys = Object.keys(events[0]);
                _.each(events, (event) => {
                    _.each(eventKeys, (field) => {
                        if (options.whitelist.indexOf(field) < 0) {
                            delete event[field];
                        }
                    });
                });

                //  default timeframe is 1 week
                if (!options.start || !options.end) {
                    options.start  = new Date();
                    options.end = new Date();
                    end.setDate(end.getDate() + 7);
                }

                events = _.filter(events, (event) => {
                    return (
                        (
                            options.start.valueOf() <
                            new Date(event.start.dateTime).valueOf()
                        ) &&
                        (
                            options.end.valueOf() >
                            new Date(event.end.dateTime).valueOf()
                        )
                    );
                });
            }
            // count
            if (options.count) {
                return events.splice(0, options.count);
            }
            return events;
        })
        .catch(err => console.log(err))
    ;

}

module.exports = { getEvents };