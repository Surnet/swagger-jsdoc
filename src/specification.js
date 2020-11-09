/* eslint no-param-reassign: 0 */
/* eslint no-self-assign: 0 */
const EOL = require('os').EOL;
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
 * Prepares the swaggerObject.
 * @see https://github.com/OAI/OpenAPI-Specification/tree/master/versions
 * @param {object} definition - The `definition` or `swaggerDefinition` from options.
 * @returns {object} swaggerObject
 */
function createSpecification(definition) {
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
function cleanSwaggerObject(swaggerObject) {
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
function finalizeSpecificationObject(swaggerObject) {
  let specification = swaggerObject;

  parser.parse(swaggerObject, (err, api) => {
    if (!err) {
      specification = api;
    }
  });

  if (specification.openapi) {
    specification = cleanSwaggerObject(specification);
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
function organizeSwaggerProperties(swaggerObject, annotation, property) {
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
 * Adds the data in to the swagger object.
 * @param {object} swaggerObject - Swagger object which will be written to
 * @param {object[]} annotations - objects of parsed swagger data from yml or jsDoc
 *                          comments
 */
function addDataToSwaggerObject(swaggerObject, annotations) {
  if (!swaggerObject || !annotations) {
    throw new Error('swaggerObject and data are required!');
  }

  for (const annotation of annotations) {
    for (const property in annotation) {
      organizeSwaggerProperties(swaggerObject, annotation, property);
    }
  }
}

function getSpecificationObject(options) {
  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  const specification = createSpecification(definition);
  const specificationParts = { yaml: [], jsdoc: [] };
  const yaml = [];

  for (const file of convertGlobPaths(options.apis)) {
    const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
    const ext = path.extname(file);
    const part = getApiFileContent(fileContent, ext);

    if (part.yaml.length) {
      specificationParts.yaml.push();
    }
    if (part.jsdoc.length) {
      specificationParts.jsdoc.push(part.jsdoc);
    }
  }

  for (const yamlParts of specificationParts.yaml) {
    yaml.push(...yamlParts);
  }

  specificationParts.jsdoc.map((annotations) => {
    for (const annotation of annotations) {
      const jsDocComment = doctrine.parse(annotation, { unwrap: true });
      yaml.push(...extractYamlFromJsDoc(jsDocComment));
    }
  });

  debugger;
  addDataToSwaggerObject(specification, jsYaml.safeLoad(yaml.join(EOL)));

  return finalizeSpecificationObject(specification);
}

module.exports.createSpecification = createSpecification;
module.exports.finalizeSpecificationObject = finalizeSpecificationObject;
module.exports.getSpecificationObject = getSpecificationObject;
module.exports.addDataToSwaggerObject = addDataToSwaggerObject;
