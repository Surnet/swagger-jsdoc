const { build } = require('./specification');

/**
 * Generates the specification.
 * @param {object} options - Configuration options
 * @param {object} options.swaggerDefinition
 * @param {object} options.definition
 * @param {array} options.apis
 * @returns {object} Output specification
 */
module.exports = (options) => {
  if (!options) {
    throw new Error(`Missing or invalid input: 'options' is required`);
  }

  if (!options.swaggerDefinition && !options.definition) {
    throw new Error(
      `Missing or invalid input: 'options.swaggerDefinition' or 'options.definition' is required`
    );
  }

  if (!options.apis || !Array.isArray(options.apis)) {
    throw new Error(
      `Missing or invalid input: 'options.apis' is required and it should be an array.`
    );
  }

  return build(options);
};
