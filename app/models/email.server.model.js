'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Email Schema
 */
var EmailSchema = new Schema({
	to: {
		type: String,
		default: '',
	},
	content: {
		type: String, 
		default: ''
	},
	subject: {
		type: String, 
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Email', EmailSchema);