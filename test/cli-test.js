/* global it, describe, after */

// Dependencies.
const { exec } = require('child_process');
const chai = require('chai');

const { expect } = chai;
const fs = require('fs');

describe('command line interface', () => {
  it('help menu works', done => {
    const helpCommand = `${process.env.PWD}/bin/swagger-jsdoc.js -h`;
    exec(helpCommand, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Usage:');
      done();
    });
  });

  it('help menu is default fallback when no arguments', done => {
    const helpCommand = `${process.env.PWD}/bin/swagger-jsdoc.js`;
    exec(helpCommand, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Usage:');
      done();
    });
  });

  it('should require a definition file', done => {
    const wrongDefinition = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js wrongDefinition`;
    exec(wrongDefinition, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Definition file is required.');
      done();
    });
  });

  it('should require an info object in the definition', done => {
    const wrongDefinition = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d test/fixtures/empty_definition.js`;
    exec(wrongDefinition, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain(
        'Definition file should contain an info object!'
      );
      done();
    });
  });

  it('should require title and version in the info object', done => {
    const wrongDefinition = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d test/fixtures/wrong_definition.js`;
    exec(wrongDefinition, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain(
        'The title and version properties are required!'
      );
      done();
    });
  });

  it('should warn when deprecated properties are used', done => {
    const deprecatedProperties = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d example/swaggerDef.js test/fixtures/deprecated_routes.js`;
    exec(deprecatedProperties, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stderr).to.contain('You are using properties to be deprecated');
      done();
    });
  });

  it('should require arguments with jsDoc data about an API', done => {
    const missingApis = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d example/swaggerDef.js`;
    exec(missingApis, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain(
        'You must provide sources for reading API files.'
      );
      done();
    });
  });

  it('should create swagger.json by default when the API input is good', done => {
    const goodInput = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d example/swaggerDef.js example/routes.js`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      expect(stderr).to.not.contain(
        'You are using properties to be deprecated'
      );
      const specification = fs.statSync('swagger.json');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should create swagger.json by default when the API input is from definition file', done => {
    const goodInput = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d test/fixtures/api_definition.js`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      expect(stderr).to.not.contain(
        'You are using properties to be deprecated'
      );
      const specification = fs.statSync('swagger.json');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should accept custom configuration for output specification', done => {
    const goodInput = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d example/swaggerDef.js -o customSpec.json example/routes.js`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      const specification = fs.statSync('customSpec.json');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should create a YAML swagger spec when a custom output configuration with a .yaml extension is used', done => {
    const goodInput = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d example/swaggerDef.js -o customSpec.yaml example/routes.js`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      const specification = fs.statSync('customSpec.yaml');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  it('should create a YAML swagger spec when a custom output configuration with a .yml extension is used', done => {
    const goodInput = `${
      process.env.PWD
    }/bin/swagger-jsdoc.js -d example/swaggerDef.js -o customSpec.yml example/routes.js`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      const specification = fs.statSync('customSpec.yml');
      // Check that the physical file was created.
      expect(specification.nlink).to.be.above(0);
      done();
    });
  });

  // Cleanup test files if any.
  after(() => {
    const defaultSpecification = `${process.env.PWD}/swagger.json`;
    const customSpecification = `${process.env.PWD}/customSpec.json`;
    const customSpecYaml = `${process.env.PWD}/customSpec.yaml`;
    const customSpecYml = `${process.env.PWD}/customSpec.yml`;
    fs.unlinkSync(defaultSpecification);
    fs.unlinkSync(customSpecification);
    fs.unlinkSync(customSpecYaml);
    fs.unlinkSync(customSpecYml);
  });
});
