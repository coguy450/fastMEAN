'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Application Schema
 */
var ApplicationSchema = new Schema({
	name: {
		type: String,
		required: 'Please fill in a Name for the Application',
        unique: 'Application name must be unique',
		trim: true
	},
    itpkmid: {
        type: String
    },
    description: {
        type: String
    },
	//ejh updating to array from string
    roles: {
        type: Array

    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Object,
		ref: 'User'
	}
});

mongoose.model('Application', ApplicationSchema);
