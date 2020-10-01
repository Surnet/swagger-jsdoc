/* eslint no-unused-expressions: 0 */
const specHelper = require('../lib/helpers/specification');
const hasEmptyProperty = require('../lib/helpers/hasEmptyProperty');

const swaggerObject = require('./fixtures/v2/swaggerObject.json');
const testData = require('./fixtures/v2/testData');

describe('Helpers', () => {
  describe('addDataToSwaggerObject', () => {
    it('should be a function', () => {
      expect(typeof specHelper.addDataToSwaggerObject).toBe('function');
    });

    it('should validate input', () => {
      expect(() => {
        specHelper.addDataToSwaggerObject();
      }).toThrow('swaggerObject and data are required!');
    });

    it('should handle "definition" and "definitions"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.definitions);
      expect(swaggerObject.definitions).toEqual({
        DefinitionSingular: {
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
        DefinitionPlural: {
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      });
    });

    it('should handle "parameter" and "parameters"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.parameters);
      expect(swaggerObject.parameters).toEqual({
        ParameterSingular: {
          name: 'username',
          description: 'Username to use for login.',
          in: 'formData',
          required: true,
          type: 'string',
        },
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

    it('should handle "securityDefinition" and "securityDefinitions"', () => {
      specHelper.addDataToSwaggerObject(
        swaggerObject,
        testData.securityDefinitions
      );
      expect(swaggerObject.securityDefinitions).toEqual({
        basicAuth: {
          type: 'basic',
          description:
            'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`',
        },
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

    it('should handle "response" and "responses"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.responses);
      expect(swaggerObject.responses).toEqual({
        NotFound: { description: 'Entity not found.' },
        IllegalInput: { description: 'Illegal input for operation.' },
      });
    });
  });

  it('paths should not override each other', () => {
    // eslint-disable-next-line
    const swagger = require('../lib');

    let testObject = {
      swaggerDefinition: {},
      apis: ['./**/*/external/*.yml'],
    };

    testObject = swagger(testObject);
    expect(testObject).toEqual({
      swagger: '2.0',
      paths: {},
      definitions: {},
      responses: {
        api: {
          foo: { 200: { description: 'OK' } },
          bar: { 200: { description: 'OK' } },
        },
      },
      parameters: {},
      securityDefinitions: {},
      tags: [],
    });
  });

  it('hasEmptyProperty() identifies object with an empty object or array as property', () => {
    const invalidA = { foo: {} };
    const invalidB = { foo: [] };
    const validA = { foo: { bar: 'baz' } };
    const validB = { foo: ['¯_(ツ)_/¯'] };
    const validC = { foo: '¯_(ツ)_/¯' };

    expect(hasEmptyProperty(invalidA)).toBe(true);
    expect(hasEmptyProperty(invalidB)).toBe(true);
    expect(hasEmptyProperty(validA)).toBe(false);
    expect(hasEmptyProperty(validB)).toBe(false);
    expect(hasEmptyProperty(validC)).toBe(false);
  });
});
