const jsYaml = require('js-yaml');

/**
 * Filters JSDoc comments for those tagged with '@swagger'
 * @function
 * @param {array} jsDocComments - JSDoc comments
 * @returns {array} JSDoc comments tagged with '@swagger'
 * @requires js-yaml
 */
function filterJsDocComments(jsDocComments) {
  const swaggerJsDocComments = [];

  for (let i = 0; i < jsDocComments.length; i += 1) {
    const jsDocComment = jsDocComments[i];
    for (let j = 0; j < jsDocComment.tags.length; j += 1) {
      const tag = jsDocComment.tags[j];
      if (tag.title === 'swagger' || tag.title === 'openapi') {
        swaggerJsDocComments.push(jsYaml.safeLoad(tag.description));
      }
    }
  }

  return swaggerJsDocComments;
}

module.exports = filterJsDocComments;
