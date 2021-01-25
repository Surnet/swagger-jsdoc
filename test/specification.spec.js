import specModule from '../src/specification.js';

const swaggerObject = {
  info: {
    title: 'Hello World',
    version: '1.0.0',
    description: 'A sample API',
  },
  host: 'localhost:3000',
  basePath: '/',
  swagger: '2.0',
  schemes: [],
  consumes: [],
  produces: [],
  paths: {},
  definitions: {},
  responses: {},
  parameters: {},
  securityDefinitions: {},
  security: {},
  tags: [],
  externalDocs: {},
};

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

  describe('format', () => {
    it('should not modify input object when no format specified', () => {
      expect(specModule.format({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });

    it('should support yaml', () => {
      expect(specModule.format({ foo: 'bar' }, '.yaml')).toEqual('foo: bar\n');
      expect(specModule.format({ foo: 'bar' }, '.yml')).toEqual('foo: bar\n');
    });
  });
});
