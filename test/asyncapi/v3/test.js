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

const tests = ['async-api-with-examples'];

describe('AsyncApi 1.0.0 examples', () => {
  tests.forEach(test => {
    it(`Example: ${test}`, done => {
      const title = `Sample specification testing ${test}`;

      // eslint-disable-next-line
      const referenceSpecification = require(path.resolve(
        `${__dirname}/${test}/asyncapi.json`
      ));

      const definition = {
        asyncapi: '1.0.0',
        info: {
          version: '1.0.0',
          title,
        },
      };

      const options = {
        definition,
        apis: [`${__dirname}/${test}/api.js`],
      };

      const specification = swaggerJsdoc(options);
      console.log(JSON.stringify(specification, null, 2));
      expect(specification).to.matchSnapshot();
      expect(specification).to.eql(referenceSpecification);
      done();
    });
  });
});
