/** @module index */

// Dependencies
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const doctrine = require('doctrine');
const jsYaml = require('js-yaml');
const parser = require('swagger-parser');
const swaggerHelpers = require('./swagger-helpers');

/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 * @requires doctrine
 */
function parseApiFile(file) {
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
        jsDocComments.push(jsDocComment);
      }
    }
  }

  return {
    yaml,
    jsdoc: jsDocComments,
  };
}

/**
 * Filters JSDoc comments for those tagged with '@swagger'
 * @function
 * @param {array} jsDocComments - JSDoc comments
 * @returns {array} JSDoc comments tagged with '@swagger'
 * @requires js-yaml
 */
function filterJsDocComments(jsDocComments) {
  const swaggerJsDocComments = [];

  for (let i = 0; i < jsDocComments.length; i += 1) {
    const jsDocComment = jsDocComments[i];
    for (let j = 0; j < jsDocComment.tags.length; j += 1) {
      const tag = jsDocComment.tags[j];
      if (tag.title === 'swagger') {
        swaggerJsDocComments.push(jsYaml.safeLoad(tag.description));
      }
    }
  }

  return swaggerJsDocComments;
}

/**
 * Converts an array of globs to full paths
 * @function
 * @param {array} globs - Array of globs and/or normal paths
 * @return {array} Array of fully-qualified paths
 * @requires glob
 */
function convertGlobPaths(globs) {
  return globs
    .map(globString => glob.sync(globString))
    .reduce((previous, current) => previous.concat(current));
}

/**
 * Generates the swagger spec
 * @function
 * @param {object} options - Configuration options
 * @returns {array} Swagger spec
 * @requires swagger-parser
 */
module.exports = function(options) {
  /* istanbul ignore if */
  if (!options) {
    throw new Error("'options' is required.");
  } /* istanbul ignore if */ else if (!options.swaggerDefinition) {
    throw new Error("'swaggerDefinition' is required.");
  } /* istanbul ignore if */ else if (!options.apis) {
    throw new Error("'apis' is required.");
  }

  // Build basic swagger json
  let swaggerObject = swaggerHelpers.swaggerizeObj(options.swaggerDefinition);
  const apiPaths = convertGlobPaths(options.apis);

  // Parse the documentation in the APIs array.
  for (let i = 0; i < apiPaths.length; i += 1) {
    const files = parseApiFile(apiPaths[i]);
    const swaggerJsDocComments = filterJsDocComments(files.jsdoc);

    const problems = swaggerHelpers.findDeprecated([
      files,
      swaggerJsDocComments,
    ]);
    // Report a warning in case potential problems encountered.
    if (problems.length > 0) {
      console.warn('You are using properties to be deprecated in v2.0.0');
      console.warn('Please update to align with the swagger v2.0 spec.');
      console.warn(problems);
    }

    swaggerHelpers.addDataToSwaggerObject(swaggerObject, files.yaml);
    swaggerHelpers.addDataToSwaggerObject(swaggerObject, swaggerJsDocComments);
  }

  parser.parse(swaggerObject, (err, api) => {
    if (!err) {
      swaggerObject = api;
    }
  });

  return swaggerObject;
};
