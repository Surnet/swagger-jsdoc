import swaggerJsdoc from '../../src/lib.js';
import { readFile } from 'fs/promises';

const referenceSpecification = JSON.parse(
  await readFile(new URL('./reference-specification.json', import.meta.url))
);

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
