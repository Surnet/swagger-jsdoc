const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mergeWith = require('lodash.mergewith');

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
 * @param {string} filePath
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 */
function extractAnnotations(filePath, encoding = 'utf8') {
  const fileContent = fs.readFileSync(filePath, { encoding });
  const ext = path.extname(filePath);
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
      regexResults = fileContent.match(csDocRegex) || [];
      for (const result of regexResults) {
        let part = result.split('###');
        part[0] = `/**`;
        part[part.length - 1] = '*/';
        part = part.join('');
        jsdoc.push(part);
      }
      break;

    default: {
      regexResults = fileContent.match(jsDocRegex) || [];
      for (const result of regexResults) {
        jsdoc.push(result);
      }
    }
  }

  return { yaml, jsdoc };
}

/**
 * @param {object} tag
 * @param {array} tags
 * @returns {boolean}
 */
function isTagPresentInTags(tag, tags) {
  const match = tags.find((targetTag) => tag.name === targetTag.name);
  if (match) return true;

  return false;
}

/**
 * Get an object of the definition file configuration.
 * @param {string} defPath
 * @param {object} swaggerDefinition
 */
function loadDefinition(defPath, swaggerDefinition) {
  const resolvedPath = path.resolve(defPath);
  const extName = path.extname(resolvedPath);

  // eslint-disable-next-line
  const loadCjs = () => require(resolvedPath);
  const loadJson = () => JSON.parse(swaggerDefinition);
  // eslint-disable-next-line
  const loadYaml = () => require('yaml').parse(swaggerDefinition);

  const LOADERS = {
    '.js': loadCjs, // on purpose, to allow throwing by nodejs and .cjs suggestion
    '.cjs': loadCjs,
    '.json': loadJson,
    '.yml': loadYaml,
    '.yaml': loadYaml,
  };

  const loader = LOADERS[extName];

  if (loader === undefined) {
    throw new Error('Definition file should be .cjs, .json, .yml or .yaml');
  }

  return loader();
}

/**
 * A recursive deep-merge that ignores null values when merging.
 * This returns the merged object and does not mutate.
 * @param {object} first the first object to get merged
 * @param {object} second the second object to get merged
 */
function mergeDeep(first, second) {
  return mergeWith({}, first, second, (a, b) => (b === null ? a : undefined));
}

module.exports.mergeDeep = mergeDeep;
module.exports.convertGlobPaths = convertGlobPaths;
module.exports.hasEmptyProperty = hasEmptyProperty;
module.exports.extractYamlFromJsDoc = extractYamlFromJsDoc;
module.exports.extractAnnotations = extractAnnotations;
module.exports.isTagPresentInTags = isTagPresentInTags;
module.exports.loadDefinition = loadDefinition;
