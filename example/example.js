'use strict';
const port = 3000;
const secrets = require('../secrets');
const express = require('express');
const app = express();
const googleCal = require('../index.js')
app.use(express.static(__dirname));

app.get('/cal', function(req, res) {

    const start  = new Date();
    const end = new Date();
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
        return res.json(events);
    });
})

app.listen(port, function() {
    console.log('Gcal Events up and running');
});