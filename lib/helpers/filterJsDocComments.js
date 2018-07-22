var jsYaml = require("js-yaml");

/**
 * Filters JSDoc comments for those tagged with '@swagger'
 * @function
 * @param {array} jsDocComments - JSDoc comments
 * @returns {array} JSDoc comments tagged with '@swagger'
 * @requires js-yaml
 */
function filterJsDocComments(jsDocComments) {
  var swaggerJsDocComments = [];

  for (var i = 0; i < jsDocComments.length; i = i + 1) {
    var jsDocComment = jsDocComments[i];
    for (var j = 0; j < jsDocComment.tags.length; j = j + 1) {
      var tag = jsDocComment.tags[j];
      if (tag.title === "swagger") {
        swaggerJsDocComments.push(jsYaml.safeLoad(tag.description));
      }
    }
  }

  return swaggerJsDocComments;
}

module.exports = filterJsDocComments;
