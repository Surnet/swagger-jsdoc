/* eslint no-param-reassign: 0 */
/* eslint no-self-assign: 0 */
const parser = require('swagger-parser');

const {
  hasEmptyProperty,
  convertGlobPaths,
  parseApiFile,
  getAnnotations,
} = require('./utils');

/**
 * Adds necessary properties for a given specification.
 * @see https://github.com/OAI/OpenAPI-Specification/tree/master/versions
 * @param {object} definition - The `definition` or `swaggerDefinition` from options.
 * @returns {object} Object containing required properties of a given specification version.
 */
function createSpecification(definition) {
  const specification = JSON.parse(JSON.stringify(definition));

  // Properties corresponding to their specifications.
  const v2 = [
    'paths',
    'definitions',
    'responses',
    'parameters',
    'securityDefinitions',
  ];
  const v3 = [...v2, 'components'];

  if (specification.openapi) {
    specification.openapi = specification.openapi;
    v3.forEach((property) => {
      specification[property] = specification[property] || {};
    });
  } else if (specification.swagger) {
    specification.swagger = specification.swagger;
    v2.forEach((property) => {
      specification[property] = specification[property] || {};
    });
  } else {
    specification.swagger = '2.0';
    v2.forEach((property) => {
      specification[property] = specification[property] || {};
    });
  }

  specification.tags = specification.tags || [];

  return specification;
}

/**
 * OpenAPI specification validator does not accept empty values for a few properties.
 * Solves validator error: "Schema error should NOT have additional properties"
 * @param {object} inputSpec - The swagger/openapi specification
 * @param {object} improvedSpec - The cleaned version of the inputSpec
 */
function cleanUselessProperties(inputSpec) {
  const improvedSpec = JSON.parse(JSON.stringify(inputSpec));
  const toClean = [
    'definitions',
    'responses',
    'parameters',
    'securityDefinitions',
  ];

  toClean.forEach((unnecessaryProp) => {
    if (hasEmptyProperty(improvedSpec[unnecessaryProp])) {
      delete improvedSpec[unnecessaryProp];
    }
  });

  return improvedSpec;
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
    specification = cleanUselessProperties(specification);
  }

  return specification;
}

/**
 * Checks if tag is already contained withing target.
 * The tag is an object of type http://swagger.io/specification/#tagObject
 * The target, is the part of the swagger specification that holds all tags.
 * @param {object} target - Swagger object place to include the tags data.
 * @param {object} tag - Swagger tag object to be included.
 * @returns {boolean} Does tag is already present in target
 */
function tagDuplicated(target, tag) {
  // Check input is workable.
  if (target && target.length && tag) {
    for (let i = 0; i < target.length; i += 1) {
      const targetTag = target[i];
      // The name of the tag to include already exists in the taget.
      // Therefore, it's not necessary to be added again.
      if (targetTag.name === tag.name) {
        return true;
      }
    }
  }

  // This will indicate that `tag` is not present in `target`.
  return false;
}

/**
 * Adds the tags property to a swagger object.
 * @param {object} conf - Flexible configuration.
 */
function attachTags(conf) {
  const { tag, swaggerObject, propertyName } = conf;

  if (Array.isArray(tag)) {
    for (let i = 0; i < tag.length; i += 1) {
      if (!tagDuplicated(swaggerObject[propertyName], tag[i])) {
        swaggerObject[propertyName].push(tag[i]);
      }
    }
  } else if (!tagDuplicated(swaggerObject[propertyName], tag)) {
    swaggerObject[propertyName].push(tag);
  }
}

/**
 * Handles swagger propertyName in pathObject context for swaggerObject.
 * @param {object} swaggerObject - The swagger object to update.
 * @param {object} pathObject - The input context of an item for swaggerObject.
 * @param {string} propertyName - The property to handle.
 */
function organizeSwaggerProperties(swaggerObject, pathObject, propertyName) {
  const simpleProperties = [
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

  // Common properties.
  if (simpleProperties.indexOf(propertyName) !== -1) {
    const definitionNames = Object.getOwnPropertyNames(
      pathObject[propertyName]
    );
    for (let k = 0; k < definitionNames.length; k += 1) {
      const definitionName = definitionNames[k];
      swaggerObject[propertyName][definitionName] = {
        ...swaggerObject[propertyName][definitionName],
        ...pathObject[propertyName][definitionName],
      };
    }
    // Tags.
  } else if (propertyName === 'tags') {
    const tag = pathObject[propertyName];
    attachTags({
      tag,
      swaggerObject,
      propertyName,
    });
    // Paths.
  } else {
    swaggerObject.paths[propertyName] = {
      ...swaggerObject.paths[propertyName],
      ...pathObject[propertyName],
    };
  }
}

/**
 * Adds the data in to the swagger object.
 * @param {object} swaggerObject - Swagger object which will be written to
 * @param {object[]} data - objects of parsed swagger data from yml or jsDoc
 *                          comments
 */
function addDataToSwaggerObject(swaggerObject, data) {
  if (!swaggerObject || !data) {
    throw new Error('swaggerObject and data are required!');
  }

  for (let i = 0; i < data.length; i += 1) {
    const pathObject = data[i];
    const propertyNames = Object.getOwnPropertyNames(pathObject);
    // Iterating the properties of the a given pathObject.
    for (let j = 0; j < propertyNames.length; j += 1) {
      const propertyName = propertyNames[j];
      // Do what's necessary to organize the end specification.
      organizeSwaggerProperties(swaggerObject, pathObject, propertyName);
    }
  }
}

/**
 * Given an api file parsed for its jsdoc comments and yaml files, update the
 * specification.
 *
 * @param {object} parsedFile - Parsed API file.
 * @param {object} specification - Specification accumulator.
 */
function updateSpecificationObject(parsedFile, specification) {
  addDataToSwaggerObject(specification, parsedFile.yaml);
  addDataToSwaggerObject(specification, getAnnotations(parsedFile.jsdoc));
}

function getSpecificationObject(options) {
  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  const specification = createSpecification(definition);

  // Parse the documentation containing information about APIs.
  const apiPaths = convertGlobPaths(options.apis);

  for (let i = 0; i < apiPaths.length; i += 1) {
    const parsedFile = parseApiFile(apiPaths[i]);
    updateSpecificationObject(parsedFile, specification);
  }

  return finalizeSpecificationObject(specification);
}

module.exports.createSpecification = createSpecification;
module.exports.finalizeSpecificationObject = finalizeSpecificationObject;
module.exports.getSpecificationObject = getSpecificationObject;
module.exports.addDataToSwaggerObject = addDataToSwaggerObject;
module.exports.updateSpecificationObject = updateSpecificationObject;
