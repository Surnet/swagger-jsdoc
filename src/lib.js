const { YAMLException } = require('js-yaml');

const {
  getSpecificationObject,
  createSpecification,
  updateSpecificationObject,
  finalizeSpecificationObject,
} = require('./specification');

const { parseApiFileContent } = require('./utils');

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

module.exports.createSpecification = createSpecification;
module.exports.parseApiFileContent = parseApiFileContent;
module.exports.updateSpecificationObject = updateSpecificationObject;
module.exports.finalizeSpecificationObject = finalizeSpecificationObject;
