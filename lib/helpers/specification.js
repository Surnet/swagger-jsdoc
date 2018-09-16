/* eslint no-param-reassign: 0 */

/**
 * Checks if tag is already contained withing target.
 * The tag is an object of type http://swagger.io/specification/#tagObject
 * The target, is the part of the swagger specification that holds all tags.
 * @function
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
 * @function
 * @param {object} conf - Flexible configuration.
 */
function attachTags(conf) {
  const { tag, swaggerObject, propertyName } = conf;

  // Correct deprecated property.
  if (propertyName === 'tag') {
    conf.propertyName = 'tags';
  }

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
 * List of deprecated or wrong swagger schema properties in singular.
 * @function
 * @returns {array} The list of deprecated property names.
 */
function getSwaggerSchemaWrongProperties() {
  return [
    'consume',
    'produce',
    'path',
    'tag',
    'definition',
    'securityDefinition',
    'scheme',
    'response',
    'parameter',
  ];
}

/**
 * Makes a deprecated property plural if necessary.
 * @function
 * @param {string} propertyName - The swagger property name to check.
 * @returns {string} The updated propertyName if neccessary.
 */
function correctSwaggerKey(propertyName) {
  const wrong = getSwaggerSchemaWrongProperties();
  if (wrong.indexOf(propertyName) > 0) {
    // Returns the corrected property name.
    return `${propertyName}s`;
  }
  return propertyName;
}

/**
 * Handles swagger propertyName in pathObject context for swaggerObject.
 * @function
 * @param {object} swaggerObject - The swagger object to update.
 * @param {object} pathObject - The input context of an item for swaggerObject.
 * @param {string} propertyName - The property to handle.
 */
function organizeSwaggerProperties(swaggerObject, pathObject, propertyName) {
  const simpleProperties = [
    'component',
    'components',
    'consume',
    'consumes',
    'produce',
    'produces',
    'path',
    'paths',
    'schema',
    'schemas',
    'securityDefinition',
    'securityDefinitions',
    'response',
    'responses',
    'parameter',
    'parameters',
    'definition',
    'definitions',
  ];

  // Common properties.
  if (simpleProperties.indexOf(propertyName) !== -1) {
    const keyName = correctSwaggerKey(propertyName);
    const definitionNames = Object.getOwnPropertyNames(
      pathObject[propertyName]
    );
    for (let k = 0; k < definitionNames.length; k += 1) {
      const definitionName = definitionNames[k];
      swaggerObject[keyName][definitionName] = Object.assign(
        {},
        swaggerObject[keyName][definitionName],
        pathObject[propertyName][definitionName]
      );
    }
    // Tags.
  } else if (propertyName === 'tag' || propertyName === 'tags') {
    const tag = pathObject[propertyName];
    attachTags({
      tag,
      swaggerObject,
      propertyName,
    });
    // Paths.
  } else {
    swaggerObject.paths[propertyName] = Object.assign(
      {},
      swaggerObject.paths[propertyName],
      pathObject[propertyName]
    );
  }
}

/**
 * Adds the data in to the swagger object.
 * @function
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

module.exports = {
  addDataToSwaggerObject,
};
