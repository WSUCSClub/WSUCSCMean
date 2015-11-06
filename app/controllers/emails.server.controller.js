'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Email = mongoose.model('Email'),
	_ = require('lodash'),
	nodemailer = require('nodemailer');


/**
 * Create a Email
 */
exports.create = function(req, res) {
	var email = new Email(req.body);
	email.user = req.user;

	email.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(email);
		}
	});
};

/**
 * Show the current Email
 */
exports.read = function(req, res) {
	res.jsonp(req.email);
};

/**
 * Update a Email
 */
exports.update = function(req, res) {
	var email = req.email ;

	email = _.extend(email , req.body);

	email.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(email);
		}
	});
};

/**
 * Send an Email
 */
exports.sendEmail = function(req, res) {

		var email = req.email ;

		// create reusable transporter object using SMTP transport
		var transporter = nodemailer.createTransport({
		    service: 'Gmail',
		    auth: {
		        user: 'winonastatecsclub@gmail.com',
		        pass: 'wsucompsci@14'
		    }
		});

		// NB! No need to recreate the transporter object. You can use
		// the same transporter object for all e-mails

		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
		    to: 'mhakim13@winona.com', // list of receivers
		    subject: 'Hello ✔', // Subject line
		    text: 'Hello world ✔', // plaintext body
		    html: '<b>Hello world ✔,</b> I CS club' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);

		});
};


/**
 * Delete an Email
 */
exports.delete = function(req, res) {
	var email = req.email ;

	email.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(email);
		}
	});
};

/**
 * List of Emails
 */
exports.list = function(req, res) { 
	Email.find().sort('-created').populate('user', 'displayName').exec(function(err, emails) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emails);
		}
	});
};

/**
 * Email middleware
 */
exports.emailByID = function(req, res, next, id) { 
	Email.findById(id).populate('user', 'displayName').exec(function(err, email) {
		if (err) return next(err);
		if (! email) return next(new Error('Failed to load Email ' + id));
		req.email = email ;
		next();
	});
};

/**
 * Email authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.email.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
