'use strict';

// Dependencies.
var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

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

  it('should require a definition file', function (done) {
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
  
  it('should require arguments with jsDoc data about an API', function (done) {
    var missingApis = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js';
    exec(missingApis, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('You must provide arguments for reading APIs.');
      done();
    });
  });
  
  it('should create swaggerSpec.json by default when the API input is good', function (done) {
    var goodInput = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js example/routes.js';
    exec(goodInput, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification created successfully.');
      var specification = fs.statSync('swaggerSpec.json');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });
  
  it('should accept custom configuration for output specification', function (done) {
    var goodInput = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js -o customSpec.json example/routes.js';
    exec(goodInput, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification created successfully.');
      var specification = fs.statSync('customSpec.json');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });  
  
  // Cleanup test files if any.
  after(function() {
    var defaultSpecification = process.env.PWD + '/swaggerSpec.json';
    var customSpecification = process.env.PWD + '/customSpec.json';
    fs.unlinkSync(defaultSpecification);
    fs.unlinkSync(customSpecification);
  });

});
