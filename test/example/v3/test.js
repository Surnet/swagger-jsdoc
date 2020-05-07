/* global it, before, beforeEach, describe */

const path = require('path');
const chai = require('chai');

const { expect } = chai;
const chaiJestSnapshot = require('chai-jest-snapshot');

const swaggerJsdoc = require('../../../lib');

chai.use(chaiJestSnapshot);

before(() => {
  chaiJestSnapshot.resetSnapshotRegistry();
});

beforeEach(function () {
  chaiJestSnapshot.configureUsingMochaContext(this);
});

const tests = [
  'api-with-examples',
  'callback',
  'links',
  'petstore',
  'openapi-jsdoc-annotation',
];

describe('OpenAPI examples', () => {
  tests.forEach((test) => {
    it(`Example: ${test}`, (done) => {
      const title = `Sample specification testing ${test}`;

      // eslint-disable-next-line
      const referenceSpecification = require(path.resolve(
        `${__dirname}/${test}/openapi.json`
      ));

      const definition = {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title,
        },
      };

      const options = {
        definition,
        apis: [`./test/example/v3/${test}/api.js`],
      };

      const specification = swaggerJsdoc(options);
      expect(specification).to.matchSnapshot();
      expect(specification).to.eql(referenceSpecification);
      done();
    });
  });
});
