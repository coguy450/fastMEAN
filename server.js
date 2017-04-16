'use strict';
var express = require('express'),
     app = express();
// var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

// var swig  = require('swig');
var request = require('superagent');
var controller = require('./app/controllers/server.controller.js');
var dbConn;

function conMongo(callback) {
    mongodb.connect('mongodb://localhost/test', (err, db) => {
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

// app.engine('html', swig.renderFile);
// app.set('view cache', false);
// To disable Swig's cache, do the following:
// swig.setDefaults({ cache: false });
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/favicon.ico', express.static('public/images/aetnafavicon.ico'));

app.get('/', controller.index);
app.get('/getCall', controller.getCall);

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
