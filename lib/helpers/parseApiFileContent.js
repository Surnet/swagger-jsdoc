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
  const csDocRegex = /###([\s\S]*?)###/gm;
  const yaml = [];
  const jsdoc = [];
  let regexResults = null;

  switch (ext) {
    case '.yml':
    case '.yaml':
      yaml.push(jsYaml.safeLoad(fileContent));
      break;

    case '.coffee':
      regexResults = fileContent.match(csDocRegex);
      if (regexResults) {
        for (let i = 0; i < regexResults.length; i += 1) {
          // Prepare input for doctrine
          let part = regexResults[i].split('###');
          part[0] = `/**`;
          part[regexResults.length - 1] = '*/';
          part = part.join('');
          jsdoc.push(doctrine.parse(part, { unwrap: true }));
        }
      }
      break;

    default: {
      regexResults = fileContent.match(jsDocRegex);
      if (regexResults) {
        for (let i = 0; i < regexResults.length; i += 1) {
          jsdoc.push(doctrine.parse(regexResults[i], { unwrap: true }));
        }
      }
    }
  }

  return {
    yaml,
    jsdoc,
  };
}

module.exports = parseApiFileContent;
