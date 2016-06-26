'use strict';

var exec = require('child_process').exec;
var assert = require('chai').assert;

describe('swagger definition parser', function () {
	it('should provide help menu if no arguments provided', function (done) {
		exec('../bin/swag-jsdoc.js', function (error, stdout, stderr) {
			assert.include(stdout, 'Usage');
			done();
		});
	});
});
