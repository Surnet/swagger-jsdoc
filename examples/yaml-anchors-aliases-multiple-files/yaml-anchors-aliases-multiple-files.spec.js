const swaggerJsdoc = require('../..');
const referenceSpecification = require('./reference-specification.json');

describe('Example for using anchors and aliases in YAML documents', () => {
  it('should handle references in a separate YAML file', () => {
    const result = swaggerJsdoc({
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Example with anchors and aliases in multiple files',
          version: '0.0.1',
        },
      },
      apis: [
        './examples/yaml-anchors-aliases-multiple-files/first-name.yaml',
        './examples/yaml-anchors-aliases-multiple-files/last-name.yaml',
        './examples/yaml-anchors-aliases-multiple-files/example.js',
      ],
    });
    expect(result).toEqual(referenceSpecification);
  });
});
