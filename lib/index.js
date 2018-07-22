/** @module index */
"use strict";

// Dependencies
var parser = require("swagger-parser");
var specHelper = require("./helpers/specification");
var parseApiFile = require("./helpers/parseApiFile");
var filterJsDocComments = require("./helpers/filterJsDocComments");
var convertGlobPaths = require("./helpers/convertGlobPaths");

/**
 * Generates the swagger spec
 * @function
 * @param {object} options - Configuration options
 * @returns {array} Swagger spec
 * @requires swagger-parser
 */
module.exports = function(options) {
  if (!options) {
    throw new Error("'options' is required.");
  } else if (!options.swaggerDefinition) {
    throw new Error("'swaggerDefinition' is required.");
  } else if (!options.apis) {
    throw new Error("'apis' is required.");
  }

  // Build basic swagger json
  var swaggerObject = specHelper.swaggerizeObj(options.swaggerDefinition);
  var apiPaths = convertGlobPaths(options.apis);

  // Parse the documentation in the APIs array.
  for (var i = 0; i < apiPaths.length; i = i + 1) {
    var files = parseApiFile(apiPaths[i]);
    var swaggerJsDocComments = filterJsDocComments(files.jsdoc);

    var problems = specHelper.findDeprecated([files, swaggerJsDocComments]);
    // Report a warning in case potential problems encountered.
    if (problems.length > 0) {
      console.warn("You are using properties to be deprecated in v2.0.0");
      console.warn("Please update to align with the swagger v2.0 spec.");
      console.warn(problems);
    }

    specHelper.addDataToSwaggerObject(swaggerObject, files.yaml);
    specHelper.addDataToSwaggerObject(swaggerObject, swaggerJsDocComments);
  }

  parser.parse(swaggerObject, function(err, api) {
    if (!err) {
      swaggerObject = api;
    }
  });

  return swaggerObject;
};
