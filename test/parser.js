'use strict';

// Dependencies
var request = require('supertest');
var chai = require('chai').should();

var app = require('../example/app');
var swaggerJSDoc = require('../');
var swaggerDefinition = require('../example/swaggerDef');


describe('swagger parsing features', function () {

  it('example app should output a specification with tags property via en endpoint', function (done) {
    request(app)
      .get('/api-docs.json')
      .on('response', function (response) {
        response.body.should.contain.tags;
      })
      .end(function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('main module parser should ouput a specification with tags property in a direct call', function (done) {
    var exampleApis = ['../example.routes.js', '../example.route2.js'];
    // Options for the swagger docs
    var options = {
      // Import swaggerDefinitions
      swaggerDefinition: swaggerDefinition,
      // Path to the API docs
      apis: exampleApis,
    };
    var swaggerSpecification = swaggerJSDoc(options);
    swaggerSpecification.should.contain.tags;
    done();
  });

});
