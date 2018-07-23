const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const chaiJestSnapshot = require("chai-jest-snapshot");

chai.use(chaiJestSnapshot);

before(function() {
  chaiJestSnapshot.resetSnapshotRegistry();
});

beforeEach(function() {
  chaiJestSnapshot.configureUsingMochaContext(this);
});

describe("OpenAPI examples: api-with-examples.yaml", function() {
  it("Output of swaggerJSDoc parser matches the snapshot", function(done) {
    var swaggerJsdoc = require("../../../../lib");

    var definition = {
      openapi: "3.0.0",
      info: {
        version: "v2",
        title: "Simple API overview"
      }
    };

    var options = {
      definition: definition,
      apis: ["./test/example/v3/api-with-examples/api.js"]
    };

    specification = JSON.stringify(swaggerJsdoc(options), null, 2);
    // Useful during development of the test, validating the spec
    // When test ready, add a matcher for the correct output saved in the test
    // fs.writeFileSync(path.resolve(`${__dirname}/openapi.json`), specification);
    expect(specification).to.matchSnapshot();
    done();
  });
});
