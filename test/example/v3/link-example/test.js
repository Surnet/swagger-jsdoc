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

describe("OpenAPI examples: link-example.yaml", function() {
  it("Output of swaggerJSDoc parser matches the snapshot", function(done) {
    var swaggerJsdoc = require("../../../../lib");

    var definition = {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Link Example"
      }
    };

    var options = {
      definition: definition,
      apis: ["./test/example/v3/link-example/api.js"]
    };

    specification = JSON.stringify(swaggerJsdoc(options), null, 2);
    // fs.writeFileSync(path.resolve(`${__dirname}/openapi.json`), specification);
    expect(specification).to.matchSnapshot();
    done();
  });
});
