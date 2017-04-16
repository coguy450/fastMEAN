// var models = require('../models/models.js');
// var swig = require('swig');
var request = require('superagent');
var express = require('express');


exports.index = function(req,res){
    express.static('public/index.html')
};

exports.getCall = ((req, res) => {
  console.log('getting call')
  request.get('http://www.google.com')
   .end(function(err, resp){
     res.status(200).send(resp)
    // console.log(res);
   });
})
