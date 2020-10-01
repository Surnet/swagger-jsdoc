const swaggerJsdoc = require('../lib');

describe('OpenAPI specification compatiblity', () => {
  it('should respect default properties', () => {
    // eslint-disable-next-line

    const definition = {
      openapi: '3.0.0',
      servers: [
        {
          url: '{scheme}://developer.uspto.gov/ds-api',
          variables: {
            scheme: {
              description: 'The Data Set API is accessible via https and http',
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
              description: 'The Data Set API is accessible via https and http',
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
