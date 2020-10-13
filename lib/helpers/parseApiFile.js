const fs = require('fs');
const path = require('path');
const parseApiFileContent = require('./parseApiFileContent');

/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 */
function parseApiFile(file) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  const ext = path.extname(file);

  return parseApiFileContent(fileContent, ext);
}

module.exports = parseApiFile;
