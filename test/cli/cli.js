/* global it, describe, after */

// Dependencies.
const { exec } = require('child_process');
const chai = require('chai');

const { expect } = chai;
const fs = require('fs');

describe('command line interface', () => {
  it('help menu works', (done) => {
    const helpCommand = `${process.env.PWD}/bin/swagger-jsdoc.js -h`;
    exec(helpCommand, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Usage:');
      done();
    });
  });

  it('help menu is default fallback when no arguments', (done) => {
    const helpCommand = `${process.env.PWD}/bin/swagger-jsdoc.js`;
    exec(helpCommand, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Usage:');
      done();
    });
  });

  it('should require a definition file', (done) => {
    const wrongDefinition = `${process.env.PWD}/bin/swagger-jsdoc.js wrongDefinition`;
    exec(wrongDefinition, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Definition file is required.');
      done();
    });
  });

  it('should require an info object in the definition', (done) => {
    const wrongDefinition = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/v2/empty_definition.js`;
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

  it('should require title and version in the info object', (done) => {
    const wrongDefinition = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/v2/wrong_definition.js`;
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

  it('should require arguments with jsDoc data about an API', (done) => {
    const missingApis = `${process.env.PWD}/bin/swagger-jsdoc.js -d example/v2/swaggerDef.js`;
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

  it('should create swagger.json by default when the API input is good', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d example/v2/swaggerDef.js example/v2/routes.js`;
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

  it('should create swagger.json by default when the API input is from definition file', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/v2/api_definition.js`;
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

  it('should accept custom configuration for output specification', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d example/v2/swaggerDef.js -o customSpec.json example/v2/routes.js`;
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

  it('should create a YAML swagger spec when a custom output configuration with a .yaml extension is used', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d example/v2/swaggerDef.js -o customSpec.yaml example/v2/routes.js`;
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

  it('should create a YAML swagger spec when a custom output configuration with a .yml extension is used', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d example/v2/swaggerDef.js -o customSpec.yml example/v2/routes.js`;
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

  it('should allow a JavaScript definition file', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/v2/api_definition.js`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      done();
    });
  });

  it('should allow a JSON definition file', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/api_definition.json`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      done();
    });
  });

  it('should allow a YAML definition file', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/api_definition.yaml`;
    exec(goodInput, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error, stderr);
      }
      expect(stdout).to.contain('Swagger specification is ready.');
      done();
    });
  });

  it('should reject definition file with invalid YAML syntax', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/wrong_syntax.yaml`;
    exec(goodInput, (error, stdout) => {
      expect(stdout).to.contain('tag suffix cannot contain exclamation marks');
      done();
    });
  });

  it('should reject definition file with non-JSON compatible YAML syntax', (done) => {
    const goodInput = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/non_json_compatible.yaml`;
    exec(goodInput, (error, stdout) => {
      expect(stdout).to.contain(
        'unknown tag !<tag:yaml.org,2002:js/undefined>'
      );
      done();
    });
  });

  it('should reject definition file with invalid JSON syntax', (done) => {
    const input = `${process.env.PWD}/bin/swagger-jsdoc.js -d test/fixtures/wrong_syntax.json`;
    exec(input, (error, stdout) => {
      expect(stdout).to.contain('Unexpected token t in JSON');
      done();
    });
  });

  it('should reject bad YAML identation with feedback: upper line', (done) => {
    const input = `${process.env.PWD}/bin/swagger-jsdoc.js -d example/v2/swaggerDef.js test/fixtures/wrong-yaml-identation1.js`;
    exec(input, (error, stdout, stderr) => {
      expect(stderr).to.contain('Pay attention at this place');
      done();
    });
  });

  it('should reject bad YAML identation with feedback: same line', (done) => {
    const input = `${process.env.PWD}/bin/swagger-jsdoc.js -d example/v2/swaggerDef.js test/fixtures/wrong-yaml-identation2.js`;
    exec(input, (error, stdout, stderr) => {
      expect(stderr).to.contain('Pay attention at this place');
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
