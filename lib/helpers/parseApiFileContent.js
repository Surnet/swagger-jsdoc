const doctrine = require('doctrine');
const jsYaml = require('js-yaml');

/**
 * Parse the provided API file content.
 *
 * @function
 * @param {string} fileContent - Content of the file
 * @param {string} ext - File format ('.yaml', '.yml', '.js', etc.)
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 * @requires doctrine
 */
function parseApiFileContent(fileContent, ext) {
  const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  const yaml = [];
  const jsDocComments = [];

  if (ext === '.yaml' || ext === '.yml') {
    yaml.push(jsYaml.safeLoad(fileContent));
  } else {
    const regexResults = fileContent.match(jsDocRegex);
    if (regexResults) {
      for (let i = 0; i < regexResults.length; i += 1) {
        const jsDocComment = doctrine.parse(regexResults[i], { unwrap: true });
        jsDocComments.push(jsDocComment);
      }
    }
  }

  return {
    yaml,
    jsdoc: jsDocComments,
  };
}

module.exports = parseApiFileContent;
