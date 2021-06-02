const swaggerJsdoc = require('../..');
const referenceSpecification = require('./reference-specification.json');

describe('Example for using extensions', () => {
  it('should support x-webhooks', async () => {
    const result = await swaggerJsdoc({
      swaggerDefinition: {
        info: {
          title: 'Example with extensions',
          version: '0.0.1',
        },
      },
      apis: ['./examples/extensions/example.js'],
    });
    expect(result).toEqual(referenceSpecification);
  });
});
