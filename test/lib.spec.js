const path = require('path');
const { YAMLException } = require('js-yaml');

const swaggerJsdoc = require('../src/lib');
const specHelper = require('../src/specification');

describe('Main lib module', () => {
  describe('Public APIs', () => {
    it('main module is a function', () => {
      expect(typeof swaggerJsdoc).toBe('function');
    });

    it('should expose a few utilities', () => {
      expect(typeof swaggerJsdoc.createSpecification).toBe('function');
      expect(typeof swaggerJsdoc.parseApiFileContent).toBe('function');
      expect(typeof swaggerJsdoc.updateSpecificationObject).toBe('function');
      expect(typeof swaggerJsdoc.finalizeSpecificationObject).toBe('function');
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should require options input', () => {
      expect(() => {
        swaggerJsdoc();
      }).toThrow(`Missing or invalid input: 'options' is required`);
    });

    it('should require a definition input', () => {
      expect(() => {
        swaggerJsdoc({});
      }).toThrow(
        `Missing or invalid input: 'options.swaggerDefinition' or 'options.definition' is required`
      );
    });

    it('should require an api files input', () => {
      expect(() => {
        swaggerJsdoc({ definition: {} });
      }).toThrow(
        `Missing or invalid input: 'options.apis' is required and it should be an array.`
      );

      expect(() => {
        swaggerJsdoc({ definition: {}, apis: {} });
      }).toThrow(
        `Missing or invalid input: 'options.apis' is required and it should be an array.`
      );
    });

    it('should provide verbose information for wrongly formatted yaml inputs', () => {
      specHelper.getSpecificationObject = jest.fn().mockImplementation(() => {
        throw new YAMLException('bad indentation of a mapping entry', {
          name: null,
          buffer: '/invalid_yaml:\n       - foo\n  bar\n\u0000',
          position: 30,
          line: 2,
          column: 2,
        });
      });

      expect(() => {
        swaggerJsdoc({
          swaggerDefinition: {
            info: {
              title: 'Hello World',
              version: '1.0.0',
              description: 'A sample API',
            },
            host: 'http://undefined:undefined',
            basePath: '/',
          },
          apis: ['test/files/v2/wrong-yaml-identation1.js'],
        });
      }).toThrow();
    });
  });

  describe('Specification v2: Swagger', () => {
    it('should support multiple paths', () => {
      let testObject = {
        swaggerDefinition: {},
        apis: ['./**/*/external/*.yml'],
      };

      testObject = swaggerJsdoc(testObject);
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
  });

  describe('Specification v3: OpenAPI', () => {
    const officialExamples = [
      'api-with-examples',
      'callback',
      'links',
      'petstore',
      'openapi-jsdoc-annotation',
    ];

    it('should respect default properties', () => {
      const definition = {
        openapi: '3.0.0',
        servers: [
          {
            url: '{scheme}://developer.uspto.gov/ds-api',
            variables: {
              scheme: {
                description:
                  'The Data Set API is accessible via https and http',
                enum: ['https', 'http'],
                default: 'https',
              },
            },
          },
        ],
        info: {
          description:
            'The Data Set API (DSAPI) allows the public users to discover and search USPTO exported data sets. This is a generic API that allows USPTO users to make any CSV based data files searchable through API. With the help of GET call, it returns the list of data fields that are searchable. With the help of POST call, data can be fetched based on the filters on the field names. Please note that POST call is used to search the actual data. The reason for the POST call is that it allows users to specify any complex search criteria without worry about the GET size limitations as well as encoding of the input parameters.',
          version: '1.0.0',
          title: 'USPTO Data Set API',
          contact: {
            name: 'Open Data Portal',
            url: 'https://developer.uspto.gov',
            email: 'developer@uspto.gov',
          },
        },
      };

      const options = {
        definition,
        apis: [],
      };

      expect(swaggerJsdoc(options)).toEqual({
        openapi: '3.0.0',
        servers: [
          {
            url: '{scheme}://developer.uspto.gov/ds-api',
            variables: {
              scheme: {
                description:
                  'The Data Set API is accessible via https and http',
                enum: ['https', 'http'],
                default: 'https',
              },
            },
          },
        ],
        info: {
          description:
            'The Data Set API (DSAPI) allows the public users to discover and search USPTO exported data sets. This is a generic API that allows USPTO users to make any CSV based data files searchable through API. With the help of GET call, it returns the list of data fields that are searchable. With the help of POST call, data can be fetched based on the filters on the field names. Please note that POST call is used to search the actual data. The reason for the POST call is that it allows users to specify any complex search criteria without worry about the GET size limitations as well as encoding of the input parameters.',
          version: '1.0.0',
          title: 'USPTO Data Set API',
          contact: {
            name: 'Open Data Portal',
            url: 'https://developer.uspto.gov',
            email: 'developer@uspto.gov',
          },
        },
        paths: {},
        components: {},
        tags: [],
      });
    });

    officialExamples.forEach((example) => {
      it(`Example: ${example}`, () => {
        const title = `Sample specification testing ${example}`;
        const examplePath = `${__dirname}/files/v3/${example}`;

        // eslint-disable-next-line
        const referenceSpecification = require(path.resolve(
          `${examplePath}/openapi.json`
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
          apis: [`${examplePath}/api.js`],
        };

        const specification = swaggerJsdoc(options);
        expect(specification).toEqual(referenceSpecification);
      });
    });
  });
});
