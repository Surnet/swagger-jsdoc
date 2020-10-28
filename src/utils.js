const fs = require('fs');
const path = require('path');
const glob = require('glob');
const jsYaml = require('js-yaml');
const doctrine = require('doctrine');

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
 * Filters JSDoc comments with `@swagger`/`@openapi` annotation.
 * @param {array} jsDocComments - JSDoc comments
 * @returns {array} JSDoc comments tagged with '@swagger'
 */
function getAnnotations(jsDocComments) {
  const annotations = [];

  for (let i = 0; i < jsDocComments.length; i += 1) {
    const jsDocComment = jsDocComments[i];
    for (let j = 0; j < jsDocComment.tags.length; j += 1) {
      const tag = jsDocComment.tags[j];
      if (tag.title === 'swagger' || tag.title === 'openapi') {
        annotations.push(jsYaml.safeLoad(tag.description));
      }
    }
  }

  return annotations;
}

/**
 * Parse the provided API file content.
 * @param {string} fileContent - Content of the file
 * @param {string} ext - File format ('.yaml', '.yml', '.js', etc.)
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
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

/**
 * Parses the provided API file for JSDoc comments.
 * @param {string} file - File to be parsed
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 */
function parseApiFile(file) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  const ext = path.extname(file);

  return parseApiFileContent(fileContent, ext);
}

module.exports.convertGlobPaths = convertGlobPaths;
module.exports.hasEmptyProperty = hasEmptyProperty;
module.exports.getAnnotations = getAnnotations;
module.exports.parseApiFileContent = parseApiFileContent;
module.exports.parseApiFile = parseApiFile;
