'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Member = mongoose.model('Member'),
	_ = require('lodash');

require('dotenv').load();

/**
 * Create a Member
 */
exports.create = function(req, res) {
	var member = new Member(req.body);
	member.user = req.user;

	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});
};

/**
 * Show the current Member
 */
exports.read = function(req, res) {
	res.jsonp(req.member);
};

/**
 * Update a Member
 */
exports.update = function(req, res) {
	var member = req.member ;

	member = _.extend(member , req.body);

	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});
};

/**
 * Delete an Member
 */
exports.delete = function(req, res) {
	var member = req.member ;

	member.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);

		}
	});
};

/**
 * List of Members
 */
exports.list = function(req, res) { 
	Member.find().sort('-created').populate('user', 'displayName').exec(function(err, members) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(members);
		}
	});
};

/**
 * Member middleware
 */
exports.memberByID = function(req, res, next, id) { 
	Member.findById(id).populate('user', 'displayName').exec(function(err, member) {
		if (err) return next(err);
		if (! member) return next(new Error('Failed to load Member ' + id));
		req.member = member ;
		next();
	});
};

/**
 * Member authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.member.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


/*** testing email service ***/




exports.sendemail = function(req, res) {
	var sendgrid_username   = process.env.SENDGRID_USERNAME;
	var sendgrid_password   = process.env.SENDGRID_PASSWORD;

	var SendGrid = require('sendgrid-nodejs').SendGrid;
	var sendgrid = new SendGrid('sendgrid_username', 'sendgrid_password');

	sendgrid.send({
			to: [],
			from: 'contact@wsucsclub.org',
			subject: 'RE: Hello World',
			text: 'Okay thanks'
		}, function(err, json){
			if(err) {
				return console.error(err);
			}
			console.log('Wahooo email sent');
			console.log(json);
	});
};