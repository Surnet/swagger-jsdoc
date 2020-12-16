const swaggerJsdoc = require('../..');
const referenceSpecification = require('./reference-specification.json');

describe('Example for using anchors and aliases in YAML documents', () => {
  it('should handle references in a separate YAML file', () => {
    const result = swaggerJsdoc({
      swaggerDefinition: {
        info: {
          title: 'Example with anchors and aliases',
          version: '0.0.1',
        },
      },
      apis: [
        './examples/yaml-anchors-aliases/x-amazon-apigateway-integrations.yaml',
        './examples/yaml-anchors-aliases/example.js',
      ],
    });
    expect(result).toEqual(referenceSpecification);
  });
});
