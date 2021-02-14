import jest from 'jest-mock';
import {
  prepare,
  organize,
  format,
  clean,
  finalize,
  extract,
} from '../src/specification.js';

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

    it('should accept also definition property istead of a swaggerDefinition', () => {
      const testSpec = JSON.parse(JSON.stringify(swaggerObject));
      const result = prepare({ definition: testSpec });
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

  describe('finalize', () => {
    // Node ESM with Jest and mocking is not possible at this moment
    it('should clean up when target specification is openapi', () => {
      const spec = { openapi: 'yes, please', parameters: { seeabovewhy: {} } };
      expect(finalize(spec)).toEqual({ openapi: 'yes, please' });
    });

    it('should call the format method when input options ask for it', () => {
      const spec = { openapi: 'yes' };
      expect(finalize(spec, { format: '.yaml' })).toBe('openapi: yes\n');
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

  describe('extract', () => {
    it('should throw on bad input', async () => {
      await expect(extract()).rejects.toThrow(
        'Bad input parameter: options is required, as well as options.apis[]'
      );

      await expect(extract({})).rejects.toThrow(
        'Bad input parameter: options is required, as well as options.apis[]'
      );

      await expect(extract({ apis: {} })).rejects.toThrow(
        'Bad input parameter: options is required, as well as options.apis[]'
      );

      await expect(extract({ apis: [] })).rejects.toThrow(
        'Bad input parameter: options is required, as well as options.apis[]'
      );
    });

    it('should extract annotations', async () => {
      const annotations = await extract({ apis: ['./examples/app/routes.js'] });
      expect(annotations.length).toBe(7);
    });

    it('should report issues: js files case', async () => {
      const consoleInfo = jest.spyOn(console, 'info');
      const consoleErr = jest.spyOn(console, 'error');
      const annotations = await extract({
        apis: ['./test/fixtures/wrong/example.js'],
      });
      expect(annotations.length).toBe(0);
      expect(consoleInfo).toHaveBeenCalledWith(
        'Not all input has been taken into account at your final specification.'
      );
      expect(consoleErr.mock.calls).toEqual([
        [
          "Here's the report: \n" +
            '\n' +
            '\n' +
            ' YAMLSyntaxError: All collection items must start at the same column at line 1, column 1:\n' +
            '\n' +
            '/invalid_yaml:\n' +
            '^^^^^^^^^^^^^^…\n' +
            '\n' +
            'YAMLSemanticError: Implicit map keys need to be followed by map values at line 3, column 3:\n' +
            '\n' +
            '  bar\n' +
            '  ^^^\n',
        ],
      ]);

      consoleInfo.mockClear();
      consoleErr.mockClear();
    });

    it('should report issues: yaml files case', async () => {
      const consoleInfo = jest.spyOn(console, 'info');
      const consoleErr = jest.spyOn(console, 'error');
      const annotations = await extract({
        apis: ['./test/fixtures/wrong/example.yaml'],
      });
      expect(annotations.length).toBe(0);
      expect(consoleInfo).toHaveBeenCalledWith(
        'Not all input has been taken into account at your final specification.'
      );
      expect(consoleErr.mock.calls).toEqual([
        [
          "Here's the report: \n" +
            '\n' +
            '\n' +
            ' YAMLSemanticError: The !!! tag handle is non-default and was not declared. at line 2, column 3:\n' +
            '\n' +
            '  !!!title: Hello World\n' +
            '  ^^^^^^^^^^^^^^^^^^^^^…\n' +
            '\n' +
            'YAMLSemanticError: Implicit map keys need to be on a single line at line 2, column 3:\n' +
            '\n' +
            '  !!!title: Hello World\n' +
            '  ^^^^^^^^^^^^^^^^^^^^^…\n',
        ],
      ]);

      consoleInfo.mockClear();
      consoleErr.mockClear();
    });
  });
});
