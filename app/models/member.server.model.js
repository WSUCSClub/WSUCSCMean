'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Member Schema
 */
var MemberSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Please fill Member first name',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		required: 'Please fill Member first name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},

	status: {
		type: [{
			type: String,
			enum: ['Member','Past Member','Active Member', 'Secretary', 'Public Relations Responsible','Project Committee Responsible','Vice-president','Faculty','President', 'Treasurer', 'Membership Committee responsible']
		}],
		default: 'Member'
	},
	phone: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Member', MemberSchema);
