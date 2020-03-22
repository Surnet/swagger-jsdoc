/** @module index */

const getSpecificationObject = require('./helpers/getSpecificationObject');

const createSpecification = require('./helpers/createSpecification');
const parseApiFileContent = require('./helpers/parseApiFileContent');
const updateSpecificationObject = require('./helpers/updateSpecificationObject');
const finalizeSpecificationObject = require('./helpers/finalizeSpecificationObject');

/**
 * Generates the specification.
 * @function
 * @param {object} options - Configuration options
 * @returns {object} Output specification
 * @requires swagger-parser
 */
module.exports = (options) => {
  if ((!options.swaggerDefinition || !options.definition) && !options.apis) {
    throw new Error('Provided options are incorrect.');
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
