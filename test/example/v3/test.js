const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const chaiJestSnapshot = require("chai-jest-snapshot");

var swaggerJsdoc = require("../../../lib");

chai.use(chaiJestSnapshot);

before(function() {
  chaiJestSnapshot.resetSnapshotRegistry();
});

beforeEach(function() {
  chaiJestSnapshot.configureUsingMochaContext(this);
});

const tests = ["api-with-examples", "callback", "links", "petstore"];

describe("OpenAPI examples", function() {
  tests.forEach(test => {
    it(`Example: ${test}`, function(done) {
      var title = `Sample specification testing ${test}`;

      var referenceSpecification = require(path.resolve(
        `${__dirname}/${test}/openapi.json`
      ));

      var definition = {
        openapi: "3.0.0",
        info: {
          version: "1.0.0",
          title: title
        }
      };

      var options = {
        definition: definition,
        apis: [`./test/example/v3/${test}/api.js`]
      };

      specification = swaggerJsdoc(options);
      expect(specification).to.matchSnapshot();
      expect(specification).to.eql(referenceSpecification);
      done();
    });
  });
});
