const fs = require('fs');
const path = require('path');
const doctrine = require('doctrine');
const jsYaml = require('js-yaml');

/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 * @requires doctrine
 */
function parseApiFile(file) {
  // eslint-disable-next-line
  const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  // eslint-disable-next-line
  const csDocRegex = /\#\#\#([\s\S]*?)\#\#\#/gm;
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  const ext = path.extname(file);
  const yaml = [];
  const jsDocComments = [];
  let regexResults = null;

  switch (ext) {
    case '.yml':
    case '.yaml':
      yaml.push(jsYaml.safeLoad(fileContent));
      break;

    case '.coffee':
      regexResults = fileContent.match(csDocRegex);
      break;

    default: {
      regexResults = fileContent.match(jsDocRegex);
      if (regexResults) {
        for (let i = 0; i < regexResults.length; i += 1) {
          const jsDocComment = doctrine.parse(regexResults[i], {
            unwrap: true,
          });
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
