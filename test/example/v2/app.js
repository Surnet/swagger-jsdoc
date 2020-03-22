/* global it, describe */

// Dependencies
const request = require('supertest');
const app = require('../../../example/v2/app');
const swaggerSpec = require('./swagger-spec.json');

// Check against saved swagger spec
function swaggerSpecIsCompliant(res) {
  // Check if result equals expected spec
  if (JSON.stringify(res.body) !== JSON.stringify(swaggerSpec)) {
    throw new Error('Returned spec does not equal the expected result');
  }
}

// Testing an example app parsing documentation with swagger-jsdoc.
describe('example app', () => {
  it('homepage returns a success code', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });

  it('login authentication returns a success code', (done) => {
    request(app)
      .post('/login')
      .send({
        username: 'user@domain.com',
        password: 'Password',
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });

  it('produced swagger spec is as expected', (done) => {
    request(app)
      .get('/api-docs.json')
      .expect(200)
      .expect(swaggerSpecIsCompliant)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });
});
