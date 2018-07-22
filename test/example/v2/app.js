"use strict";

// Dependencies
var request = require("supertest");
var app = require("../../../example/v2/app");
var swaggerSpec = require("./swagger-spec.json");

// Check against saved swagger spec
function swaggerSpecIsCompliant(res) {
  // Check if result equals expected spec
  if (JSON.stringify(res.body) !== JSON.stringify(swaggerSpec)) {
    throw new Error("Returned spec does not equal the expected result");
  }
}

// Testing an example app parsing documentation with swagger-jsdoc.
describe("example app", function() {
  it("homepage returns a success code", function(done) {
    request(app)
      .get("/")
      .expect(200)
      .end(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it("login authentication returns a success code", function(done) {
    request(app)
      .post("/login")
      .send({
        username: "user@domain.com",
        password: "Password"
      })
      .expect(200)
      .end(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it("produced swagger spec is as expected", function(done) {
    request(app)
      .get("/api-docs.json")
      .expect(200)
      .expect(swaggerSpecIsCompliant)
      .end(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
