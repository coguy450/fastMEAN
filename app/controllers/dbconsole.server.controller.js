'use strict';
var mongoose = require('mongoose');
var fs = require('fs-extra');
    var envLoaded = require('../../config/env/'+ process.env.NODE_ENV);
    // Connection URL
    var url;


var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');


exports.getCollections = function(req,res){
    mongoose.connection.db.collectionNames(function(err, names) {
        if (err){
            return res.status(400).send({
                message: 'error'
            });
        } else {
            res.status(200).send({collections: names});
        }
    });
};

exports.basicFind = function(req,res){
    var query,numOfResults;
    var round = Math.round;
    req.body.limit = round(req.body.limit);
    if (req.body.collName === 'errorlogs'){
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            var collection = db.collection(req.body.collName);

            collection.find({}).limit(req.body.limit).sort({received:-1}).toArray(function (err, docs) {
                if (err){
                    return res.status(400).send({
                        message: 'error'
                    });
                } else {
                    res.status(200).send({r: docs,count: docs.length});
                    db.close();
                }
            })
        });

    } else {

        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            var collection = db.collection(req.body.collName);
            collection.find({}).limit(req.body.limit).toArray(function (err, docs) {
                if (err) {
                    return res.status(400).send({
                        message: 'error'
                    });
                } else {
                    res.status(200).send({r: docs, count: docs.length});
                    db.close();
                }
            })
        });
    }
};

exports.dropCollection = function(req,res){
    mongoose.connection.db.dropCollection(req.body.coll, function(err, result) {
        if (err){
            return res.status(400).send({
                message: 'error'
            });
        } else {
            res.status(200).send({result: result});
        }
    });
};

exports.advancedFind = function(req,res){
    var query;
    var toAppend = {$regex: req.body.searchText,$options:'i'};
    var searchStr = '{"'+req.body.searchKey + '":"' + 'temp' + '"}';
    var searchObj = JSON.parse(searchStr);
    searchObj[req.body.searchKey] = toAppend;
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection(req.body.collName);
        collection.find(searchObj).toArray(function (err, docs) {
            if (err){
                return res.status(400).send({
                    message: 'error'
                });
            } else {
                res.status(200).send({r: docs,count: docs.length});
                db.close();
            }
        })
    });
};

exports.writeFile = function(req,res){
    var batLocation = './public/modules/core/consoleFiles/' + req.user._id + '-'+ req.body.coll + '.json';
    var pathToFile = '/modules/core/consoleFiles/' + req.user._id + '-'+ req.body.coll + '.json';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var collection = db.collection(req.body.coll);
        collection.find({}).toArray(function (error, docs) {
            if (error){
                return res.status(400).send({
                    message: 'Can not find any collection records'
                });

            } else {
                fs.writeJsonFile(batLocation,docs, function(writeErr){
                    if(writeErr) {

                        db.close();
                    } else{
                        res.status(200).send({path:pathToFile});
                        db.close();
                    }
                });
            }

        })
    });
};


exports.deleteDoc = function(req,res){


};
