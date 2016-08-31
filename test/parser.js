'use strict';

// Dependencies
var request = require('supertest');
var app = require('../example/app');

describe('swagger parsing features', function () {

  it('example should output a specification with tags property', function (done) {
    request(app)
      .get('/api-docs.json')
      .on('response', function (response) {
        response.body.hasOwnProperty('tags');
      })
      .end(function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});
