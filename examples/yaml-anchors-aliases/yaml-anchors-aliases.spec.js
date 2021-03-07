import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import swaggerJsdoc from 'swagger-jsdoc';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const referenceSpecification = require('./reference-specification.json');

describe('Example for using anchors and aliases in YAML documents', () => {
  it('should handle references in a separate YAML file', async () => {
    const result = await swaggerJsdoc({
      swaggerDefinition: {
        info: {
          title: 'Example with anchors and aliases',
          version: '0.0.1',
        },
      },
      apis: [
        `${__dirname}/x-amazon-apigateway-integrations.yaml`,
        `${__dirname}/properties/*.yml`,
        `${__dirname}/example.js`,
      ],
    });

    expect(result).toEqual(referenceSpecification);
  });
});
