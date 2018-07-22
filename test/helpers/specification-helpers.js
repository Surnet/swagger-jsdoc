"use strict";

// Dependencies.
var specHelper = require("../../lib/helpers/specification");
var chai = require("chai");
var expect = chai.expect;
var swaggerObject = require("../fixtures/v2/swaggerObject.json");
var testData = require("../fixtures/v2/testData");

describe("swagger-helpers submodule", function() {
  it("should have a method addDataToSwaggerObject()", function(done) {
    expect(specHelper).to.include.keys("addDataToSwaggerObject");
    expect(typeof specHelper.addDataToSwaggerObject).to.equal("function");
    done();
  });

  it("addDataToSwaggerObject() should require correct input", function(done) {
    expect(specHelper.addDataToSwaggerObject).to.throw(Error);
    done();
  });

  it('addDataToSwaggerObject() handles "definition" and "definitions"', function(done) {
    specHelper.addDataToSwaggerObject(swaggerObject, testData.definitions);
    expect(swaggerObject.definitions).to.exist;
    // Case 'definition'.
    expect(swaggerObject.definitions).to.include.keys("DefinitionSingular");
    // Case 'definitions'.
    expect(swaggerObject.definitions).to.include.keys("DefinitionPlural");
    done();
  });

  it('addDataToSwaggerObject() handles "parameter" and "parameters"', function(done) {
    specHelper.addDataToSwaggerObject(swaggerObject, testData.parameters);
    expect(swaggerObject.parameters).to.exist;
    // Case 'parameter'.
    expect(swaggerObject.parameters).to.include.keys("ParameterSingular");
    // Case 'parameters'.
    expect(swaggerObject.parameters).to.include.keys("ParameterPlural");
    done();
  });

  it('addDataToSwaggerObject() handles "securityDefinition" and "securityDefinitions"', function(done) {
    specHelper.addDataToSwaggerObject(
      swaggerObject,
      testData.securityDefinitions
    );
    expect(swaggerObject.securityDefinitions).to.exist;
    // Case 'securityDefinition'.
    expect(swaggerObject.securityDefinitions).to.include.keys("basicAuth");
    // Case 'securityDefinitions'.
    expect(swaggerObject.securityDefinitions).to.include.keys("api_key");
    done();
  });

  it('addDataToSwaggerObject() handles "response" and "responses"', function(done) {
    specHelper.addDataToSwaggerObject(swaggerObject, testData.responses);
    expect(swaggerObject.responses).to.exist;
    // Case 'response'.
    expect(swaggerObject.responses).to.include.keys("NotFound");
    // Case 'responses'.
    expect(swaggerObject.responses).to.include.keys("IllegalInput");
    done();
  });

  it("paths should not override each other", function(done) {
    var swagger = require("../../lib");

    var testObject = {
      swaggerDefinition: {},
      apis: ["./**/*/external/*.yml"]
    };

    testObject = swagger(testObject);
    expect(testObject.responses.api).to.include.keys(["foo", "bar"]);
    done();
  });
});
