const { YAMLException } = require('js-yaml');
const getSpecificationObject = require('./helpers/getSpecificationObject');

/**
 * Generates the specification.
 * @param {object} options - Configuration options
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

  try {
    const specificationObject = getSpecificationObject(options);

    return specificationObject;
  } catch (err) {
    if (err instanceof YAMLException) {
      console.log('Error in yaml file:', err.mark.buffer);
    }
    throw err;
  }
};

module.exports.createSpecification = require('./helpers/createSpecification');
module.exports.parseApiFileContent = require('./helpers/parseApiFileContent');
module.exports.updateSpecificationObject = require('./helpers/updateSpecificationObject');
module.exports.finalizeSpecificationObject = require('./helpers/finalizeSpecificationObject');
