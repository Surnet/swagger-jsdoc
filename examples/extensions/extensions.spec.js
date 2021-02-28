import { createRequire } from 'module';
import swaggerJsdoc from 'swagger-jsdoc';

const require = createRequire(import.meta.url);
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
      apis: ['./example.js'],
    });
    expect(result).toEqual(referenceSpecification);
  });
});
