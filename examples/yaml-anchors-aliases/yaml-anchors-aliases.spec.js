import fs from 'fs';
import { createRequire } from 'module';
import swaggerJsdoc from 'swagger-jsdoc';

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
        './x-amazon-apigateway-integrations.yaml',
        './properties/*.yml',
        './example.js',
      ],
    });

    fs.writeFileSync('swagger.json', JSON.stringify(result, 2, 0));

    expect(result).toEqual(referenceSpecification);
  });
});
