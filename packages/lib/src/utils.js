import { promises as fs } from 'fs';
import { extname } from 'path';
import glob from 'glob';
import mergeWith from 'lodash.mergewith';

/**
 * Converts an array of globs to full paths
 * @param {array} globs - Array of globs and/or normal paths
 * @return {array} Array of fully-qualified paths
 */
export function convertGlobPaths(globs) {
  return globs
    .map((globString) => glob.sync(globString))
    .reduce((previous, current) => previous.concat(current), []);
}

/**
 * Checks if there is any properties of the input object which are an empty object
 * @param {object} obj - the object to check
 * @returns {boolean}
 */
export function hasEmptyProperty(obj) {
  if (!obj) return;

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
export function extractYamlFromJsDoc(jsDocComment) {
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
export async function extractAnnotations(filePath, encoding = 'utf8') {
  const fileContent = await fs.readFile(filePath, { encoding });
  const ext = extname(filePath);
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
 * @param {string} tag.name
 * @param {array} tags
 * @returns {boolean}
 */
export function isTagPresentInTags(tag, tags) {
  const match = tags.find((targetTag) => tag.name === targetTag.name);
  if (match) return true;
  return false;
}

/**
 * @param {object} options
 * @returns {object} the original input if valid, throws otherwise
 */
export function validateOptions(options) {
  if (!options) {
    throw new Error(`'options' parameter is required!`);
  }

  if (!options.swaggerDefinition && !options.definition) {
    throw new Error(
      `'options.swaggerDefinition' or 'options.definition' is required!`
    );
  }

  const def = options.swaggerDefinition || options.definition;

  if (!def.info) {
    throw new Error(
      `Swagger definition ('options.swaggerDefinition') should contain an info object!`
    );
  }

  if (!('title' in def.info) || !('version' in def.info)) {
    throw new Error(
      `Swagger definition info object ('options.swaggerDefinition.info') requires title and version properties!`
    );
  }

  if (!options.apis || !Array.isArray(options.apis)) {
    throw new Error(`'options.apis' is required and it should be an array!`);
  }

  return options;
}

/**
 * A recursive deep-merge that ignores null values when merging.
 * This returns the merged object and does not mutate.
 * @param {object} first the first object to get merged
 * @param {object} second the second object to get merged
 */
export function mergeDeep(first, second) {
  return mergeWith({}, first, second, (a, b) => (b === null ? a : undefined));
}
