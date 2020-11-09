const glob = require('glob');

/**
 * Converts an array of globs to full paths
 * @param {array} globs - Array of globs and/or normal paths
 * @return {array} Array of fully-qualified paths
 */
function convertGlobPaths(globs) {
  return globs
    .map((globString) => glob.sync(globString))
    .reduce((previous, current) => previous.concat(current), []);
}

/**
 * Checks if there is any properties of the input object which are an empty object
 * @param {object} obj - the object to check
 * @returns {boolean}
 */
function hasEmptyProperty(obj) {
  return Object.keys(obj)
    .map((key) => obj[key])
    .every(
      (keyObject) =>
        typeof keyObject === 'object' &&
        Object.keys(keyObject).every((key) => !(key in keyObject))
    );
}

/**
 * Extracts the YAML description from JSDoc comments with `@swagger`/`@openapi` annotation.
 * @param {object} jsDocComment - Single item of JSDoc comments from doctrine.parse
 * @returns {array} YAML parts
 */
function extractYamlFromJsDoc(jsDocComment) {
  const yamlParts = [];

  for (const tag of jsDocComment.tags) {
    if (tag.title === 'swagger' || tag.title === 'openapi') {
      yamlParts.push(tag.description);
    }
  }

  return yamlParts;
}

/**
 * @param {string} fileContent - Content of the file
 * @param {string} ext - File format ('.yaml', '.yml', '.js', etc.)
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 */
function getApiFileContent(fileContent, ext) {
  const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  const csDocRegex = /###([\s\S]*?)###/gm;
  const yaml = [];
  const jsdoc = [];
  let regexResults = null;

  switch (ext) {
    case '.yml':
    case '.yaml':
      yaml.push(fileContent);
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
          jsdoc.push(part);
        }
      }
      break;

    default: {
      regexResults = fileContent.match(jsDocRegex);
      if (regexResults) {
        for (let i = 0; i < regexResults.length; i += 1) {
          jsdoc.push(regexResults[i]);
        }
      }
    }
  }

  return {
    yaml,
    jsdoc,
  };
}

module.exports.convertGlobPaths = convertGlobPaths;
module.exports.hasEmptyProperty = hasEmptyProperty;
module.exports.extractYamlFromJsDoc = extractYamlFromJsDoc;
module.exports.getApiFileContent = getApiFileContent;
