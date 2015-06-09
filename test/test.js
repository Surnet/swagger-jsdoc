'use strict';


// Dependencies
var request = require('supertest');
var app = require('../example/app');
var swaggerSpec = require('./swagger-spec.json');


// Check against saved swagger spec
function equalsToBeSwaggerSpec(res) {

  // Check if result equals expected spec
  if (JSON.stringify(res.body) !== JSON.stringify(swaggerSpec)) {
    throw new Error('Returned spec does not equal the expected result');
  }

}


describe('example app', function() {

  it('homepage', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('login', function(done) {
    request(app)
      .post('/login')
      .send({
        username: 'user@domain.com',
        password: 'Password',
      })
      .expect(200)
      .end(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});


describe('swagger spec', function() {

  it('equals expected result', function(done) {
    request(app)
      .get('/api-docs.json')
      .expect(200)
      .expect(equalsToBeSwaggerSpec)
      .end(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});