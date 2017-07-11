'use strict';

// The hinter will deny a lot of the chai syntax (W030).
/* jshint ignore:start */

// Dependencies.
var swaggerHelpers = require('../lib/swagger-helpers');
var chai = require('chai');
var expect = chai.expect;
var swaggerObject = require('./fixtures/swaggerObject.json');
var testData = require('./fixtures/testData');

describe('swagger-helpers submodule', function () {

  it('should have a method addDataToSwaggerObject()', function (done) {
    expect(swaggerHelpers).to.include.keys('addDataToSwaggerObject');
    expect(typeof(swaggerHelpers.addDataToSwaggerObject)).to.equal('function');
    done();
  });

  it('addDataToSwaggerObject() should require correct input', function (done) {
    expect(swaggerHelpers.addDataToSwaggerObject).to.throw(Error);
    done();
  });

  it('addDataToSwaggerObject() handles "definition" and "definitions"', function(done) {
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, testData.definitions);
    expect(swaggerObject.definitions).to.exist;
    // Case 'definition'.
    expect(swaggerObject.definitions).to.include.keys('DefinitionSingular');
    // Case 'definitions'.
    expect(swaggerObject.definitions).to.include.keys('DefinitionPlural');
    done();
  });

  it('addDataToSwaggerObject() handles "parameter" and "parameters"', function(done) {
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, testData.parameters);
    expect(swaggerObject.parameters).to.exist;
    // Case 'parameter'.
    expect(swaggerObject.parameters).to.include.keys('ParameterSingular');
    // Case 'parameters'.
    expect(swaggerObject.parameters).to.include.keys('ParameterPlural');
    done();
  });

  it('addDataToSwaggerObject() handles "securityDefinition" and "securityDefinitions"', function(done) {
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, testData.securityDefinitions);
    expect(swaggerObject.securityDefinitions).to.exist;
    // Case 'securityDefinition'.
    expect(swaggerObject.securityDefinitions).to.include.keys('basicAuth');
    // Case 'securityDefinitions'.
    expect(swaggerObject.securityDefinitions).to.include.keys('api_key');
    done();
  });

  it('addDataToSwaggerObject() handles "response" and "responses"', function(done) {
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, testData.responses);
    expect(swaggerObject.responses).to.exist;
    // Case 'response'.
    expect(swaggerObject.responses).to.include.keys('NotFound');
    // Case 'responses'.
    expect(swaggerObject.responses).to.include.keys('IllegalInput');
    done();
  });

  it('should have a method swaggerizeObj()', function (done) {
    expect(swaggerHelpers).to.include.keys('swaggerizeObj');
    expect(typeof(swaggerHelpers.swaggerizeObj)).to.equal('function');
    done();
  });
  it('swagerizeObj should remove keys specified from the blacklisted keys', function (done) {
      var testObject = {
          valid: 'Valid Key',
          apis: 'Invalid Key'
      }
      testObject = swaggerHelpers.swaggerizeObj(testObject);
      expect(testObject.apis).to.be.undefined;
      done();
  });

});
/* jshint ignore:end */
