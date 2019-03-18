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

beforeEach(function() {
  chaiJestSnapshot.configureUsingMochaContext(this);
});

const tests = ['api-with-examples', 'callback', 'links', 'petstore'];

describe('OpenAPI examples', () => {
  tests.forEach(test => {
    it(`Example: ${test}`, async () => {
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

      const specification = await swaggerJsdoc(options);
      expect(specification).to.matchSnapshot();
      expect(specification).to.eql(referenceSpecification);
    });

    it(`Example: ${test} --resolveReferences`, async () => {
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
        resolveReferences: true,
      };

      const specification = await swaggerJsdoc(options);
      const json = JSON.stringify(specification, null, 2);
      expect(json).to.not.contain('$ref');
    });
  });
});
