const specHelper = require('./specification');
const filterJsDocComments = require('./filterJsDocComments');

/**
 * Given an api file parsed for its jsdoc comments and yaml files, update the
 * specification.
 *
 * @param {object} parsedFile - Parsed API file.
 * @param {object} specification - Specification accumulator.
 */
function updateSpecificationObject(parsedFile, specification) {
  specHelper.addDataToSwaggerObject(specification, parsedFile.yaml);

  specHelper.addDataToSwaggerObject(
    specification,
    filterJsDocComments(parsedFile.jsdoc)
  );
}

module.exports = updateSpecificationObject;
