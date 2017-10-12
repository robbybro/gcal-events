# GCal Events
## API to get events from a given Google Calendar

Define a secrets.js file that looks like
```
    module.exports = {
        apiKey: XXX,
        calendarid: XXX,
    };
```
or paste key/id directly into options passed to library.

[Create an api key through google API console](https://console.developers.google.com) and enable it for Google Calendar use.

[Get the calendar ID that you want to populate events from](https://support.appmachine.com/hc/en-us/articles/203645966-Use-Google-Calendar-ID-for-the-Events-block)

gcal-get-events takes an object that looks like
```
    {
        whitelist: [],
        start: <ms>,
        end: <ms>,
        count: <# events to return>
        apiKey: <secrets.apiKey>,
        calendarId: <secrets.calendarId>
    }
```

`whitelist` contains the fields that you would like returned. If `whitelist` is empty, all fields will be returned. Fields include:
* created
* creator
* end
* etag
* htmlLink
* iCalUID
* id
* kind
* location
* organizer
* originalStartTime
* sequence
* start
* status
* summary
* updated

`start` and `end` specify the time frame you would like events returned within (in ms). Omitting these fields will result in a default start of now and default end of one week from now.

`count` specifies the number of events to return.