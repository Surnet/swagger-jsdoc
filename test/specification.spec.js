const specModule = require('../src/specification');
const swaggerObject = require('./files/v2/swaggerObject.json');

describe('Specification module', () => {
  describe('organize', () => {
    it('should be a function', () => {
      expect(typeof specModule.organize).toBe('function');
    });

    it('should handle "definitions"', () => {
      const annotation = {
        definitions: {
          testDefinition: {
            required: ['username', 'password'],
            properties: {
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      };
      specModule.organize(swaggerObject, annotation, 'definitions');
      expect(swaggerObject.definitions).toEqual({
        testDefinition: {
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      });
    });

    it('should handle "parameters"', () => {
      const annotation = {
        parameters: {
          testParameter: {
            name: 'limit',
            in: 'query',
            description: 'max records to return',
            required: true,
            type: 'integer',
            format: 'int32',
          },
        },
      };
      specModule.organize(swaggerObject, annotation, 'parameters');
      expect(swaggerObject.parameters).toEqual({
        testParameter: {
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
      const annotation = {
        securityDefinitions: {
          basicAuth: {
            type: 'basic',
            description:
              'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`',
          },
        },
      };
      specModule.organize(swaggerObject, annotation, 'securityDefinitions');
      expect(swaggerObject.securityDefinitions).toEqual({
        basicAuth: {
          type: 'basic',
          description:
            'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`',
        },
      });
    });

    it('should handle "responses"', () => {
      const annotation = {
        responses: {
          IllegalInput: {
            description: 'Illegal input for operation.',
          },
        },
      };
      specModule.organize(swaggerObject, annotation, 'responses');
      expect(swaggerObject.responses).toEqual({
        IllegalInput: { description: 'Illegal input for operation.' },
      });
    });
  });
});
