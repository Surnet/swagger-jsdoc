var fs = require("fs");
var path = require("path");
var doctrine = require("doctrine");
var jsYaml = require("js-yaml");

/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 * @requires doctrine
 */
function parseApiFile(file) {
  var jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  var fileContent = fs.readFileSync(file, { encoding: "utf8" });
  var ext = path.extname(file);
  var yaml = [];
  var jsDocComments = [];

  if (ext === ".yaml" || ext === ".yml") {
    yaml.push(jsYaml.safeLoad(fileContent));
  } else {
    var regexResults = fileContent.match(jsDocRegex);
    if (regexResults) {
      for (var i = 0; i < regexResults.length; i = i + 1) {
        var jsDocComment = doctrine.parse(regexResults[i], { unwrap: true });
        jsDocComments.push(jsDocComment);
      }
    }
  }

  return {
    yaml: yaml,
    jsdoc: jsDocComments
  };
}

module.exports = parseApiFile;
