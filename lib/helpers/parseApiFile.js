const fs = require('fs');
const path = require('path');
const doctrine = require('doctrine');
const jsYaml = require('js-yaml');

/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @param {object} jsDocFilter - Function returning boolean to filter docs
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 * @requires doctrine
 */
function parseApiFile(file, jsDocFilter) {
  const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  const ext = path.extname(file);
  const yaml = [];
  const jsDocComments = [];

  if (ext === '.yaml' || ext === '.yml') {
    yaml.push(jsYaml.safeLoad(fileContent));
  } else {
    const regexResults = fileContent.match(jsDocRegex);
    if (regexResults) {
      for (let i = 0; i < regexResults.length; i += 1) {
        const jsDocComment = doctrine.parse(regexResults[i], { unwrap: true });

        if (typeof jsDocFilter !== 'function' || !!jsDocFilter(jsDocComment)) {
          jsDocComments.push(jsDocComment);
        }
      }
    }
  }

  return {
    yaml,
    jsdoc: jsDocComments,
  };
}

module.exports = parseApiFile;
