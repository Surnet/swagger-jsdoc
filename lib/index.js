/** @module index */

const getSpecificationObject = require('./helpers/getSpecificationObject');

/**
 * Generates the specification.
 * @function
 * @param {object} options - Configuration options
 * @returns {object} Output specification
 * @requires swagger-parser
 */
module.exports = options => {
  if ((!options.swaggerDefinition || !options.definition) && !options.apis) {
    throw new Error('Provided options are incorrect.');
  }

  const specificationObject = getSpecificationObject(options);

  return specificationObject;
};
