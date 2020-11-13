const parser = require('swagger-parser');
const jsYaml = require('js-yaml');
const doctrine = require('doctrine');

const {
  hasEmptyProperty,
  convertGlobPaths,
  extractAnnotations,
  extractYamlFromJsDoc,
  isTagPresentInTags,
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
    for (const definition of Object.keys(annotation[property])) {
      swaggerObject[property][definition] = {
        ...swaggerObject[property][definition],
        ...annotation[property][definition],
      };
    }
  } else if (property === 'tags') {
    const { tags } = annotation;

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (!isTagPresentInTags(tag, swaggerObject.tags)) {
          swaggerObject.tags.push(tag);
        }
      }
    } else if (!isTagPresentInTags(tags, swaggerObject.tags)) {
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

  for (const filePath of convertGlobPaths(options.apis)) {
    const {
      yaml: yamlAnnotations,
      jsdoc: jsdocAnnotations,
    } = extractAnnotations(filePath);

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

module.exports = { prepare, build, organize, finalize };
