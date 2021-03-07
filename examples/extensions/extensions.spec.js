import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import swaggerJsdoc from 'swagger-jsdoc';

const __dirname = dirname(fileURLToPath(import.meta.url));
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
      apis: [`${__dirname}/example.js`],
    });
    expect(result).toEqual(referenceSpecification);
  });
});
