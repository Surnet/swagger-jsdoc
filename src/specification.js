/* eslint no-param-reassign: 0 */
/* eslint no-self-assign: 0 */
const fs = require('fs');
const path = require('path');
const parser = require('swagger-parser');
const jsYaml = require('js-yaml');
const doctrine = require('doctrine');

const {
  hasEmptyProperty,
  convertGlobPaths,
  getApiFileContent,
  extractYamlFromJsDoc,
} = require('./utils');

/**
 * Prepare the swagger/openapi specification object.
 * @see https://github.com/OAI/OpenAPI-Specification/tree/master/versions
 * @param {object} definition - The `definition` or `swaggerDefinition` from options.
 * @returns {object} swaggerObject
 */
function prepare(definition) {
  let version;
  const swaggerObject = JSON.parse(JSON.stringify(definition));
  const specificationTemplate = {
    v2: [
      'paths',
      'definitions',
      'responses',
      'parameters',
      'securityDefinitions',
    ],
    v3: [
      'paths',
      'definitions',
      'responses',
      'parameters',
      'securityDefinitions',
      'components',
    ],
  };

  if (swaggerObject.openapi) {
    version = 'v3';
  } else if (swaggerObject.swagger) {
    version = 'v2';
  } else {
    version = 'v2';
    swaggerObject.swagger = '2.0';
  }

  specificationTemplate[version].forEach((property) => {
    swaggerObject[property] = swaggerObject[property] || {};
  });

  swaggerObject.tags = swaggerObject.tags || [];

  return swaggerObject;
}

/**
 * OpenAPI specification validator does not accept empty values for a few properties.
 * Solves validator error: "Schema error should NOT have additional properties"
 * @param {object} swaggerObject
 * @returns {object} swaggerObject
 */
function clean(swaggerObject) {
  for (const prop of [
    'definitions',
    'responses',
    'parameters',
    'securityDefinitions',
  ]) {
    if (hasEmptyProperty(swaggerObject[prop])) {
      delete swaggerObject[prop];
    }
  }

  return swaggerObject;
}

/**
 * Parse the swagger object and remove useless properties if necessary.
 *
 * @param {object} swaggerObject - Swagger object from parsing the api files.
 * @returns {object} The specification.
 */
function finalize(swaggerObject) {
  let specification = swaggerObject;

  parser.parse(swaggerObject, (err, api) => {
    if (!err) {
      specification = api;
    }
  });

  if (specification.openapi) {
    specification = clean(specification);
  }

  return specification;
}

/**
 * @param {array} tags property of swaggerObject specification
 * @param {object} tag
 * @returns {boolean}
 */
function isTagPresentInSpec(tags, tag) {
  if (tags && tags.length && tag) {
    for (let i = 0; i < tags.length; i += 1) {
      const targetTag = tags[i];
      if (targetTag.name === tag.name) {
        return true;
      }
    }
  }

  return false;
}

/**
 * @param {object} swaggerObject
 * @param {object} annotation
 * @param {string} property
 */
function organize(swaggerObject, annotation, property) {
  if (property.startsWith('x-')) return; // extensions defined "inline" in annotations are not useful for the end specification

  const commonProperties = [
    'components',
    'consumes',
    'produces',
    'paths',
    'schemas',
    'securityDefinitions',
    'responses',
    'parameters',
    'definitions',
  ];

  if (commonProperties.includes(property)) {
    Object.keys(annotation[property]).forEach((definition) => {
      swaggerObject[property][definition] = {
        ...swaggerObject[property][definition],
        ...annotation[property][definition],
      };
    });
  } else if (property === 'tags') {
    const { tags } = annotation;

    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        if (!isTagPresentInSpec(swaggerObject.tags, tag)) {
          swaggerObject.tags.push(tag);
        }
      });
    } else if (!isTagPresentInSpec(swaggerObject.tags, tags)) {
      swaggerObject.tags.push(tags);
    }
  } else {
    // Paths which are not defined as "paths" property, starting with a slash "/"
    swaggerObject.paths[property] = {
      ...swaggerObject.paths[property],
      ...annotation[property],
    };
  }
}

/**
 * @param {object} options
 * @returns {object} swaggerObject
 */
function build(options) {
  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  const specification = prepare(definition);
  const yamlData = [];

  for (const file of convertGlobPaths(options.apis)) {
    const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
    const ext = path.extname(file);
    const {
      yaml: yamlAnnotations,
      jsdoc: jsdocAnnotations,
    } = getApiFileContent(fileContent, ext);

    if (yamlAnnotations.length) {
      yamlData.push(...yamlAnnotations);
    }
    if (jsdocAnnotations.length) {
      for (const annotation of jsdocAnnotations) {
        const jsDocComment = doctrine.parse(annotation, { unwrap: true });
        yamlData.push(...extractYamlFromJsDoc(jsDocComment));
      }
    }
  }

  for (const rawYamlDocument of yamlData) {
    jsYaml.safeLoadAll(rawYamlDocument, (annotation) => {
      for (const property in annotation) {
        organize(specification, annotation, property);
      }
    });
  }

  return finalize(specification);
}

module.exports.prepare = prepare;
module.exports.build = build;
module.exports.finalize = finalize;
