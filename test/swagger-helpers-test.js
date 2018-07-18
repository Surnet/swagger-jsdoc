/* global it, describe */

// Dependencies.
const chai = require('chai');
const swaggerHelpers = require('../lib/swagger-helpers');

const { expect } = chai;
const swaggerObject = require('./fixtures/swaggerObject.json');
const testData = require('./fixtures/testData');

describe('swagger-helpers submodule', () => {
  it('should have a method addDataToSwaggerObject()', done => {
    expect(swaggerHelpers).to.include.keys('addDataToSwaggerObject');
    expect(typeof swaggerHelpers.addDataToSwaggerObject).to.equal('function');
    done();
  });

  it('addDataToSwaggerObject() should require correct input', done => {
    expect(swaggerHelpers.addDataToSwaggerObject).to.throw(Error);
    done();
  });

  it('addDataToSwaggerObject() handles "definition" and "definitions"', done => {
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, testData.definitions);
    expect(swaggerObject.definitions).to.exist;
    // Case 'definition'.
    expect(swaggerObject.definitions).to.include.keys('DefinitionSingular');
    // Case 'definitions'.
    expect(swaggerObject.definitions).to.include.keys('DefinitionPlural');
    done();
  });

  it('addDataToSwaggerObject() handles "parameter" and "parameters"', done => {
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, testData.parameters);
    expect(swaggerObject.parameters).to.exist;
    // Case 'parameter'.
    expect(swaggerObject.parameters).to.include.keys('ParameterSingular');
    // Case 'parameters'.
    expect(swaggerObject.parameters).to.include.keys('ParameterPlural');
    done();
  });

  it('addDataToSwaggerObject() handles "securityDefinition" and "securityDefinitions"', done => {
    swaggerHelpers.addDataToSwaggerObject(
      swaggerObject,
      testData.securityDefinitions
    );
    expect(swaggerObject.securityDefinitions).to.exist;
    // Case 'securityDefinition'.
    expect(swaggerObject.securityDefinitions).to.include.keys('basicAuth');
    // Case 'securityDefinitions'.
    expect(swaggerObject.securityDefinitions).to.include.keys('api_key');
    done();
  });

  it('addDataToSwaggerObject() handles "response" and "responses"', done => {
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, testData.responses);
    expect(swaggerObject.responses).to.exist;
    // Case 'response'.
    expect(swaggerObject.responses).to.include.keys('NotFound');
    // Case 'responses'.
    expect(swaggerObject.responses).to.include.keys('IllegalInput');
    done();
  });

  it('should have a method swaggerizeObj()', done => {
    expect(swaggerHelpers).to.include.keys('swaggerizeObj');
    expect(typeof swaggerHelpers.swaggerizeObj).to.equal('function');
    done();
  });

  it('swagerizeObj should remove keys specified from the blacklisted keys', done => {
    let testObject = {
      valid: 'Valid Key',
      apis: 'Invalid Key',
    };
    testObject = swaggerHelpers.swaggerizeObj(testObject);
    expect(testObject.apis).to.be.undefined;
    done();
  });
});
