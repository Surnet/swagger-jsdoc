'use strict';

// Dependencies.
var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;

describe('command line interface', function () {

  it('help menu works', function (done) {
    var helpCommand = process.env.PWD + '/bin/swagger-jsdoc.js -h';
    exec(helpCommand, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Usage:');
      done();
    });
  });

  it('help menu is default fallback when no arguments', function (done) {
    var helpCommand = process.env.PWD + '/bin/swagger-jsdoc.js';
    exec(helpCommand, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Usage:');
      done();
    });
  });

  it('should require definition file', function (done) {
    var wrongDefinition = process.env.PWD + '/bin/swagger-jsdoc.js wrongDefinition';
    exec(wrongDefinition, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Definition file is required.');
      done();
    });
  });

  it('should require an info object in the definition', function (done) {
    var wrongDefinition = process.env.PWD + '/bin/swagger-jsdoc.js -d test/fixtures/empty_definition.js';
    exec(wrongDefinition, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Definition file should contain an info object!');
      done();
    });
  });

  it('should require title and version in the info object', function (done) {
    var wrongDefinition = process.env.PWD + '/bin/swagger-jsdoc.js -d test/fixtures/wrong_definition.js';
    exec(wrongDefinition, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('The title and version properties are required!');
      done();
    });
  });

});
