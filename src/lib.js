const { build } = require('./specification');

/**
 * Generates the specification.
 * @param {object} options - Configuration options
 * @param {string} options.encoding Optional, passed to readFileSync options. Defaults to 'utf8'.
 * @param {boolean} options.failOnErrors Whether or not to throw when parsing errors. Defaults to false.
 * @param {string} options.format Optional, defaults to '.json' - target file format '.yml' or '.yaml'.
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
