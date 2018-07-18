'use strict';
// The hinter will deny a lot of the chai syntax (W030).
/* jshint ignore:start */

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

  it('should warn when deprecated properties are used', function (done) {
    var deprecatedProperties = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js test/fixtures/deprecated_routes.js';
    exec(deprecatedProperties, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stderr).to.contain('You are using properties to be deprecated');
      done();
    });
  });

  it('should require arguments with jsDoc data about an API', function (done) {
    var missingApis = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js';
    exec(missingApis, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('You must provide sources for reading API files.');
      done();
    });
  });

  it('should create swagger.json by default when the API input is good', function (done) {
    var goodInput = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js example/routes.js';
    exec(goodInput, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      expect(stderr).to.not.contain('You are using properties to be deprecated');
      var specification = fs.statSync('swagger.json');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should create swagger.json by default when the API input is from definition file', function (done) {
    var goodInput = process.env.PWD + '/bin/swagger-jsdoc.js -d test/fixtures/api_definition.js';
    exec(goodInput, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      expect(stderr).to.not.contain('You are using properties to be deprecated');
      var specification = fs.statSync('swagger.json');
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
      expect(stdout).to.contain('Swagger specification is ready.');
      var specification = fs.statSync('customSpec.json');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should create a YAML swagger spec when a custom output configuration with a .yaml extension is used', function (done) {
    var goodInput = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js -o customSpec.yaml example/routes.js';
    exec(goodInput, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      var specification = fs.statSync('customSpec.yaml');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should create a YAML swagger spec when a custom output configuration with a .yml extension is used', function (done) {
    var goodInput = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js -o customSpec.yml example/routes.js';
    exec(goodInput, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      var specification = fs.statSync('customSpec.yml');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should fail when invalid swagger tag is provided', function (done) {
    var invalidTag = process.env.PWD + '/bin/swagger-jsdoc.js -d example/swaggerDef.js test/fixtures/invalid_tag.js';
    exec(invalidTag, function (error, stdout, stderr) {
      expect(error).to.not.be.undefined;
      expect(stderr).to.contain('YAMLException');
      done();
    });
  });


  // Cleanup test files if any.
  after(function() {
    var defaultSpecification = process.env.PWD + '/swagger.json';
    var customSpecification = process.env.PWD + '/customSpec.json';
    var customSpecYaml = process.env.PWD + '/customSpec.yaml';
    var customSpecYml = process.env.PWD + '/customSpec.yml';
    fs.unlinkSync(defaultSpecification);
    fs.unlinkSync(customSpecification);
    fs.unlinkSync(customSpecYaml);
    fs.unlinkSync(customSpecYml);
  });

});
/* jshint ignore:end */
