const parser = require('swagger-parser');
const createSpecification = require('./createSpecification');
const specHelper = require('./specification');
const parseApiFile = require('./parseApiFile');
const filterJsDocComments = require('./filterJsDocComments');
const convertGlobPaths = require('./convertGlobPaths');

function isEmptyObject(obj) {
  // eslint-disable-next-line
  Object.keys(obj).forEach(key => {
    if (key in obj) return false;
  });

  return true;
}

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

  toClean.forEach(unncessaryProp => {
    if (isEmptyObject(improvedSpec[unncessaryProp])) {
      delete improvedSpec[unncessaryProp];
    }
  });

  return improvedSpec;
}

function getSpecificationObject(options) {
  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  let specification = createSpecification(definition);

  // Parse the documentation containing information about APIs.
  const apiPaths = convertGlobPaths(options.apis);

  for (let i = 0; i < apiPaths.length; i += 1) {
    const files = parseApiFile(apiPaths[i]);
    const swaggerJsDocComments = filterJsDocComments(files.jsdoc);

    specHelper.addDataToSwaggerObject(specification, files.yaml);
    specHelper.addDataToSwaggerObject(specification, swaggerJsDocComments);
  }

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
