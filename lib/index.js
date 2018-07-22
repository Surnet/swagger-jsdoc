/** @module index */
"use strict";

var getSpecificationObject = require("./helpers/getSpecificationObject");

/**
 * Generates the specification.
 * @function
 * @param {object} options - Configuration options
 * @returns {object} Output specification
 * @requires swagger-parser
 */
module.exports = function(options) {
  if ((!options.swaggerDefinition || !options.definition) && !options.apis) {
    throw new Error("Provided options are incorrect.");
  }

  var specificationObject = getSpecificationObject(options);

  return specificationObject;
};
