var parser = require("swagger-parser");
var createSpecification = require("./createSpecification");
var specHelper = require("./specification");
var parseApiFile = require("./parseApiFile");
var filterJsDocComments = require("./filterJsDocComments");
var convertGlobPaths = require("./convertGlobPaths");

function isEmptyObject(obj) {
  for (var key in obj) {
    if (key in obj) return false;
  }
  return true;
}

/**
 * OpenAPI specification validator does not accept empty values for a few properties.
 * Solves validator error: "Schema error should NOT have additional properties"
 * @function
 * @param {object} inputSpec - The swagger/openapi specification
 * @param {object} improvedSpec - The cleaned version of the inputSpec
 */
function cleanUselessProperties(specification) {
  var spec = JSON.parse(JSON.stringify(specification));
  var toClean = [
    "definitions",
    "responses",
    "parameters",
    "securityDefinitions"
  ];

  toClean.forEach(unncessaryProp => {
    if (isEmptyObject(spec[unncessaryProp])) {
      delete spec[unncessaryProp];
    }
  });

  return spec;
}

function getSpecificationObject(options) {
  // Get input definition and prepare the specification's skeleton
  var definition = options.swaggerDefinition || options.definition;
  var specification = createSpecification(definition);

  // Parse the documentation containing information about APIs.
  var apiPaths = convertGlobPaths(options.apis);

  for (var i = 0; i < apiPaths.length; i = i + 1) {
    var files = parseApiFile(apiPaths[i]);
    var swaggerJsDocComments = filterJsDocComments(files.jsdoc);

    specHelper.addDataToSwaggerObject(specification, files.yaml);
    specHelper.addDataToSwaggerObject(specification, swaggerJsDocComments);
  }

  parser.parse(specification, function(err, api) {
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
