const getSpecificationObject = require('./helpers/getSpecificationObject');

const createSpecification = require('./helpers/createSpecification');
const parseApiFileContent = require('./helpers/parseApiFileContent');
const updateSpecificationObject = require('./helpers/updateSpecificationObject');
const finalizeSpecificationObject = require('./helpers/finalizeSpecificationObject');

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
    let msg = err.message;
    if (err.mark && err.mark.buffer && err.mark.line) {
      const { line } = err.mark;
      const bufferParts = err.mark.buffer.split('\n');
      bufferParts[
        line
      ] = `${bufferParts[line]} -------------- Pay attention at this place`;
      msg = bufferParts.join('\n');
    }
    console.warn(msg);
    throw new Error(err);
  }
};

module.exports.createSpecification = createSpecification;
module.exports.parseApiFileContent = parseApiFileContent;
module.exports.updateSpecificationObject = updateSpecificationObject;
module.exports.finalizeSpecificationObject = finalizeSpecificationObject;
