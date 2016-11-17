'use strict';
var express = require('express'),
     app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var swig  = require('swig');
var request = require('superagent');
var controller = require('./app/controllers/server.controller.js');
var dbConn;

function conMongo(callback) {
    mongodb.connect('mongodb://localhost/facebookHack', {db: { autoReconnect: true, connectTimeoutMS: 30000 }}, (err, db) => {
        if (err) {
            console.log(err);
        } else {
            dbConn = (!err ? db : null);
            callback(dbConn);
        }
    })
};



app.set('view engine', 'html');
app.set('view options', {
    layout: false
});

app.engine('html', swig.renderFile);
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.get('/manager', controller.index);
app.post('/', function(req, res) {
    var data = req.body;
    if (data.object === 'page') {
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;
            console.log(entry);
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    console.log('event', event);
                    conMongo((db) => {
                        const messages = db.collection('fbMessages');
                        messages.insert(event);
                    })
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        res.sendStatus(200);

    }
});


app.post('/webhook', (req, res) => {
    console.log(req);
    res.sendStatus(200);
})

const sendFacebookMessage = () => {
    request
        .post('https://graph.facebook.com/v2.6/me/messages?access_token=TOKEN')

        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ "recipient": {"id":"1089616971154388"},"message" :{"text":"hello, world!"}})
        .end(function(err, res){
            if (err || !res.ok) {
                console.log(err);
            } else {
                console.log('yay got ' + JSON.stringify(res.body));
            }
        })
}
app.get('/sendMessage', sendFacebookMessage);


app.get('/messages', (req, res) => {
    conMongo((db) => {
        const messages = db.collection('fbMessages');
        messages.find({}).toArray((error, results) => {
            res.status(200).send(results);
        })
    })
})






var server = app.listen('3005', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at port:'+ port);
});

// catch 404 and forward to error handler

app.use(function(req, res, next) {
    console.log(req.url);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
       console.log(err);
    });
}


module.exports = app;



