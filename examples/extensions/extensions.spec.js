import { createRequire } from 'module';
import swaggerJsdoc from '../../src/lib.js';

const require = createRequire(import.meta.url);
const referenceSpecification = require('./reference-specification.json');

describe('Example for using extensions', () => {
  it('should support x-webhooks', () => {
    const result = swaggerJsdoc({
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
