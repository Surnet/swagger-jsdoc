var parser = require("swagger-parser");
var createSpecification = require("./createSpecification");
var specHelper = require("./specification");
var parseApiFile = require("./parseApiFile");
var filterJsDocComments = require("./filterJsDocComments");
var convertGlobPaths = require("./convertGlobPaths");

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

  return specification;
}

module.exports = getSpecificationObject;
