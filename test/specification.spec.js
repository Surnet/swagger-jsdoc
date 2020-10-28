/* eslint no-unused-expressions: 0 */

const specHelper = require('../src/specification');

const swaggerObject = require('./files/v2/swaggerObject.json');
const testData = require('./files/v2/testData');

describe('Specification module', () => {
  describe('addDataToSwaggerObject', () => {
    it('should be a function', () => {
      expect(typeof specHelper.addDataToSwaggerObject).toBe('function');
    });

    it('should validate input', () => {
      expect(() => {
        specHelper.addDataToSwaggerObject();
      }).toThrow('swaggerObject and data are required!');
    });

    it('should handle  "definitions"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.definitions);
      expect(swaggerObject.definitions).toEqual({
        DefinitionPlural: {
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      });
    });

    it('should handle "parameters"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.parameters);
      expect(swaggerObject.parameters).toEqual({
        ParameterPlural: {
          name: 'limit',
          in: 'query',
          description: 'max records to return',
          required: true,
          type: 'integer',
          format: 'int32',
        },
      });
    });

    it('should handle "securityDefinitions"', () => {
      specHelper.addDataToSwaggerObject(
        swaggerObject,
        testData.securityDefinitions
      );
      expect(swaggerObject.securityDefinitions).toEqual({
        api_key: { type: 'apiKey', name: 'api_key', in: 'header' },
        petstore_auth: {
          type: 'oauth2',
          authorizationUrl: 'http://swagger.io/api/oauth/dialog',
          flow: 'implicit',
          scopes: {
            'write:pets': 'modify pets in your account',
            'read:pets': 'read your pets',
          },
        },
      });
    });

    it('should handle "responses"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.responses);
      expect(swaggerObject.responses).toEqual({
        IllegalInput: { description: 'Illegal input for operation.' },
      });
    });
  });
});
