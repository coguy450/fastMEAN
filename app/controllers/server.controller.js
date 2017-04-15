// var models = require('../models/models.js');
// var mongoose = require('mongoose');
// var swig = require('swig');
var express = require('express');


exports.index = function(req,res){
  console.log('serving')
    express.static('public/index.html')

    };
