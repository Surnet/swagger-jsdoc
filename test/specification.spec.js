const path = require('path');
const fs = require('fs');
const specModule = require('../src/specification');
const swaggerObject = require('./files/v2/swaggerObject.json');

const originalReadFileSync = fs.readFileSync;
let readFileSyncSpy;
describe('Specification module', () => {
  describe('build', () => {
    beforeEach(() => {
      readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    });

    afterEach(() => {
      readFileSyncSpy.mockRestore();
    });

    it('should be a function', () => {
      expect(typeof specModule.build).toBe('function');
    });

    it('should return right object', () => {
      expect(
        specModule.build({
          swaggerDefinition: {},
          apis: ['./**/*/external/*.yml'],
        })
      ).toEqual({
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

    it('should not throw an error if file cannot be open, and failOnErrors is false', () => {
      readFileSyncSpy.mockImplementation((filePath, options) => {
        if (
          filePath === path.resolve(__dirname, './files/v2/wrong_syntax.yaml')
        ) {
          throw new Error('ENOENT: no such file or directory');
        }

        return originalReadFileSync(filePath, options);
      });

      expect(
        specModule.build({
          swaggerDefinition: {},
          apis: [
            path.resolve(__dirname, './files/v2/wrong_syntax.yaml'),
            path.resolve(__dirname, './files/v2/api_definition.yaml'),
          ],
          failOnErrors: false,
        })
      ).toEqual({
        swagger: '2.0',
        paths: {
          info: {
            title: 'Hello World',
            version: '1.0.0',
            description: 'A sample API',
          },
        },
        definitions: {},
        responses: {},
        parameters: {},
        securityDefinitions: {},
        tags: [],
      });
    });

    it('should throw an error if file cannot be open, and failOnErrors is true', () => {
      readFileSyncSpy.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      expect(() => {
        specModule.build({
          swaggerDefinition: {},
          apis: [path.resolve(__dirname, './files/v2/wrong_syntax.yaml')],
          failOnErrors: true,
        });
      }).toThrow();
    });

    it('should have filepath in error (yaml)', () => {
      expect(() => {
        specModule.build({
          swaggerDefinition: {},
          apis: [path.resolve(__dirname, './files/v2/wrong_syntax.yaml')],
          failOnErrors: true,
        });
      }).toThrow(`Error in ${path.resolve(
        __dirname,
        './files/v2/wrong_syntax.yaml'
      )} :
YAMLSemanticError: The !!! tag handle is non-default and was not declared. at line 2, column 3:

  !!!title: Hello World
  ^^^^^^^^^^^^^^^^^^^^^…

YAMLSemanticError: Implicit map keys need to be on a single line at line 2, column 3:

  !!!title: Hello World
  ^^^^^^^^^^^^^^^^^^^^^…\n`);
    });

    it('should have filepath in error (jsdoc)', () => {
      expect(() => {
        specModule.build({
          swaggerDefinition: {},
          apis: [
            path.resolve(__dirname, './files/v2/wrong-yaml-identation.js'),
          ],
          failOnErrors: true,
        });
      }).toThrow(`Error in ${path.resolve(
        __dirname,
        './files/v2/wrong-yaml-identation.js'
      )} :
YAMLSyntaxError: All collection items must start at the same column at line 1, column 1:

/invalid_yaml:
^^^^^^^^^^^^^^…

YAMLSemanticError: Implicit map keys need to be followed by map values at line 3, column 3:

  bar
  ^^^\n`);
    });

    it('should support a flag for verbose errors', () => {
      expect(() => {
        specModule.build({
          swaggerDefinition: {},
          apis: [
            path.resolve(__dirname, './files/v2/wrong-yaml-identation.js'),
          ],
          failOnErrors: true,
          verbose: true,
        });
      }).toThrow(`Error in ${path.resolve(
        __dirname,
        './files/v2/wrong-yaml-identation.js'
      )} :
YAMLSyntaxError: All collection items must start at the same column at line 1, column 1:

/invalid_yaml:
^^^^^^^^^^^^^^…

Imbedded within:
\`\`\`
  /invalid_yaml:
         - foo
    bar
\`\`\`
YAMLSemanticError: Implicit map keys need to be followed by map values at line 3, column 3:

  bar
  ^^^

Imbedded within:
\`\`\`
  /invalid_yaml:
         - foo
    bar
\`\`\``);
    });
  });

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
