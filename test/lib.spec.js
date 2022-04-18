const path = require('path');

const swaggerJsdoc = require('../src/lib');

describe('Main lib module', () => {
  describe('General', () => {
    it('should be a function', () => {
      expect(typeof swaggerJsdoc).toBe('function');
    });

    it('should support custom encoding', () => {
      const result = swaggerJsdoc({
        swaggerDefinition: {
          info: {
            title: 'Example weird characters',
            version: '1.0.0',
          },
        },
        apis: ['./test/fixtures/non-utf-file.js'],
        encoding: 'ascii',
      });

      expect(result).toEqual({
        info: { title: 'Example weird characters', version: '1.0.0' },
        swagger: '2.0',
        paths: {
          '/no-utf8': {
            get: {
              description:
                "p\u001d\u00175D\u0015E\u0000a87p\u001d\u0019$ a:\u0018a;#p\u001d\u0019'a8;D\u000f",
              responses: {
                200: {
                  description:
                    'j\u001e\u000eG\u0012I<p\u001d\u0019\u001aa6\u0006 a;\u000bb2#E\u001da;+I1',
                },
              },
            },
          },
        },
        definitions: {},
        responses: {},
        parameters: {},
        securityDefinitions: {},
        tags: [],
      });
    });
  });

  describe('Specification v3: OpenAPI', () => {
    const officialExamples = ['callback', 'links', 'petstore'];

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
