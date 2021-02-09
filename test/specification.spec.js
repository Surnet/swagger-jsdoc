import { prepare, organize, format, clean } from '../src/specification.js';

const swaggerObject = {
  info: {
    title: 'Hello World',
    version: '1.0.0',
  },
  responses: {},
  definitions: {},
  parameters: {},
  securityDefinitions: {},
};

describe('Specification module', () => {
  describe('prepare', () => {
    it('should produce swagger specification by default: backwards compatibility', () => {
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      const result = prepare({ swaggerDefinition: testSpec });
      expect(result.swagger).toBe('2.0');
      expect(result.tags).toEqual([]);
      expect(result.paths).toEqual({});
    });

    it(`should produce swagger specification when 'swagger' property`, () => {
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      testSpec.swagger = '2.0';
      let result = prepare({ swaggerDefinition: testSpec });
      expect(result.swagger).toBe('2.0');
      expect(result.tags).toEqual([]);
      expect(result.paths).toEqual({});
    });

    it(`should produce openapi specification when 'openapi' property`, () => {
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      testSpec.openapi = '3.0';
      const result = prepare({ swaggerDefinition: testSpec });
      expect(result.openapi).toBe('3.0');
      expect(result.tags).toEqual([]);
      expect(result.paths).toEqual({});
      expect(result.components).toEqual({});
    });
  });

  describe('organize', () => {
    it('should support merging', () => {
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      const annotations = [
        {
          responses: {
            api: {
              foo: {
                200: {
                  description: 'OK',
                },
              },
            },
          },
        },
        {
          responses: {
            api: {
              bar: {
                200: {
                  description: 'OK',
                },
              },
            },
          },
        },
      ];

      organize(testSpec, annotations);
      expect(testSpec.responses).toEqual({
        api: {
          bar: { 200: { description: 'OK' } },
          foo: { 200: { description: 'OK' } },
        },
      });
    });

    it('should handle "definitions"', () => {
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      const annotations = [
        {
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
        },
      ];
      organize(testSpec, annotations);
      expect(testSpec.definitions).toEqual({
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
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      const annotations = [
        {
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
        },
      ];
      organize(testSpec, annotations);
      expect(testSpec.parameters).toEqual({
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
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      const annotations = [
        {
          securityDefinitions: {
            basicAuth: {
              type: 'basic',
              description:
                'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`',
            },
          },
        },
      ];
      organize(testSpec, annotations);
      expect(testSpec.securityDefinitions).toEqual({
        basicAuth: {
          type: 'basic',
          description:
            'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`',
        },
      });
    });

    it('should handle "responses"', () => {
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      const annotations = [
        {
          responses: {
            IllegalInput: {
              description: 'Illegal input for operation.',
            },
          },
        },
      ];
      organize(testSpec, annotations);
      expect(testSpec.responses).toEqual({
        IllegalInput: { description: 'Illegal input for operation.' },
      });
    });
  });

  describe('format', () => {
    it('should not modify input object when no format specified', () => {
      expect(format({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });

    it('should support yaml', () => {
      expect(format({ foo: 'bar' }, '.yaml')).toEqual('foo: bar\n');
      expect(format({ foo: 'bar' }, '.yml')).toEqual('foo: bar\n');
    });
  });

  describe('clean', () => {
    it('should ensure clean property definitions', () => {
      expect(clean({ definitions: { foo: {} } })).toEqual({});
    });

    it('should ensure clean property responses', () => {
      expect(clean({ responses: { foo: {} } })).toEqual({});
    });

    it('should ensure clean property parameters', () => {
      expect(clean({ parameters: { foo: {} } })).toEqual({});
    });

    it('should ensure clean property securityDefinitions', () => {
      expect(clean({ securityDefinitions: { foo: {} } })).toEqual({});
    });

    it('should not clean other cases', () => {
      expect(clean({ misc: { foo: {} } })).toEqual({ misc: { foo: {} } });
    });
  });
});
