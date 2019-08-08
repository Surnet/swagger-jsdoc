const parser = require('swagger-parser');
const hasEmptyProperty = require('./hasEmptyProperty');

/**
 * OpenAPI specification validator does not accept empty values for a few properties.
 * Solves validator error: "Schema error should NOT have additional properties"
 * @function
 * @param {object} inputSpec - The swagger/openapi specification
 * @param {object} improvedSpec - The cleaned version of the inputSpec
 */
function cleanUselessProperties(inputSpec) {
  const improvedSpec = JSON.parse(JSON.stringify(inputSpec));
  const toClean = [
    'definitions',
    'responses',
    'parameters',
    'securityDefinitions',
  ];

  toClean.forEach(unnecessaryProp => {
    if (hasEmptyProperty(improvedSpec[unnecessaryProp])) {
      delete improvedSpec[unnecessaryProp];
    }
  });

  return improvedSpec;
}

/**
 * Parse the swagger object and remove useless properties if necessary.
 *
 * @param {object} swaggerObject - Swagger object from parsing the api files.
 * @returns {object} The specification.
 */
function finalizeSpecificationObject(swaggerObject) {
  let specification = swaggerObject;

  parser.parse(swaggerObject, (err, api) => {
    if (!err) {
      specification = api;
    }
  });

  if (specification.openapi) {
    specification = cleanUselessProperties(specification);
  }

  return specification;
}

module.exports = finalizeSpecificationObject;
