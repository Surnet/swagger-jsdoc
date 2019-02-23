const parser = require('swagger-parser');
const jsYaml = require('js-yaml');
const createSpecification = require('./createSpecification');
const specHelper = require('./specification');
const parseApiFile = require('./parseApiFile');
const prepareYamlSpec = require('./prepareYamlSpec');
const convertGlobPaths = require('./convertGlobPaths');
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

function getSpecificationObject(options) {
  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  const specParts = [];

  let specification = createSpecification(definition);

  // Parse the documentation containing information about APIs.
  const apiPaths = convertGlobPaths(options.apis);

  for (let i = 0; i < apiPaths.length; i += 1) {
    const files = parseApiFile(apiPaths[i]);
    specParts.push(files);
  }

  const yamlPreparedSpec = prepareYamlSpec(specParts);

  const specYaml = jsYaml.safeLoad(yamlPreparedSpec);

  specHelper.addDataToSwaggerObject(specification, specYaml);

  parser.parse(specification, (err, api) => {
    if (!err) {
      specification = api;
    }
  });

  if (specification.openapi) {
    specification = cleanUselessProperties(specification);
  }

  return specification;
}

module.exports = getSpecificationObject;
