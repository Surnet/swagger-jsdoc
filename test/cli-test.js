'use strict';

// Dependencies.
var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;

describe('command line interface', function () {

  it('help menu works', function (done) {
    var helpCommand = process.env.PWD + '/bin/swagger-jsdoc.js -h';
    exec(helpCommand, function (error, stdout, stderr) {
      expect(stdout).to.contain('Usage:');
      done();
    });
  });

  it('help menu is default fallback when no arguments', function (done) {
    var helpCommand = process.env.PWD + '/bin/swagger-jsdoc.js';
    exec(helpCommand, function (error, stdout, stderr) {
      expect(stdout).to.contain('Usage:');
      done();
    });
  });


});
