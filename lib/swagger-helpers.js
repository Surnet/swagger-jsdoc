'use strict';

/**
 * Yields a warning for a given deprecated property.
 * @function
 * @param {string} propertyName - The property to warn about.
 */
function _deprecatedPropertyWarning(propertyName) {
  if (propertyName === 'tag') {
    console.warn('tag will be deprecated in v2.0.0');
    console.warn('Please use tags as it aligns with the swagger v2.0 spec.');
  }
}

/**
 * Adds the tags property to a swagger object.
 * @function
 * @param {object} conf - Flexible configuration.
 */
function _attachTags(conf) {
  var tag = conf.tag;
  var swaggerObject = conf.swaggerObject;
  var propertyName = conf.propertyName;

  // Correct deprecated property.
  if (propertyName === 'tag') {
    propertyName = 'tags';
  }

  if (Array.isArray(tag)) {
    for (var i = 0; i < tag.length; i = i + 1) {
      swaggerObject[propertyName].push(tag[i]);
    }
  } else {
    swaggerObject[propertyName].push(tag);
  }
}

/**
 * Merges two objects
 * @function
 * @param {object} obj1 - Object 1
 * @param {object} obj2 - Object 2
 * @returns {object} Merged Object
 */
function _objectMerge(obj1, obj2) {
  var obj3 = {};
  for (var attr in obj1) {
    if (obj1.hasOwnProperty(attr)) {
      obj3[attr] = obj1[attr];
    }
  }
  for (var name in obj2) {
    if (obj2.hasOwnProperty(name)) {
      obj3[name] = obj2[name];
    }
  }
  return obj3;
}

/**
 * Adds necessary swagger schema object properties.
 * @see https://goo.gl/Eoagtl
 * @function
 * @param {object} swaggerObject - The object to receive properties.
 * @returns {object} swaggerObject - The updated object.
 */
function swaggerizeObj(swaggerObject) {
  swaggerObject.swagger = '2.0';
  swaggerObject.paths = swaggerObject.paths || {};
  swaggerObject.definitions = swaggerObject.definitions || {};
  swaggerObject.responses = swaggerObject.responses || {};
  swaggerObject.parameters = swaggerObject.parameters || {};
  swaggerObject.securityDefinitions = swaggerObject.securityDefinitions || {};
  swaggerObject.tags = swaggerObject.tags || [];
  return swaggerObject;
}

/**
 * List of deprecated property names.
 * @function
 * @returns {array} The list of deprecated property names.
 */
function _getDeprecatePropertyNames() {
  return [
    'tag',
    'definition',
    'securityDefinition',
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
function _getSwaggerKey(propertyName) {
  var deprecated = _getDeprecatePropertyNames();
  if (deprecated.indexOf(propertyName) > 0) {
    // Returns the corrected property name.
    return propertyName + 's';
  }
  return propertyName;
}

/**
 * Adds the data in to the swagger object.
 * @function
 * @param {object} swaggerObject - Swagger object which will be written to
 * @param {object[]} data - objects of parsed swagger data from yaml or jsDoc
 *                          comments
 */
function addDataToSwaggerObject(swaggerObject, data) {
  if (!swaggerObject || !data) {
    throw new Error('swaggerObject and data are required!');
  }

  for (var i = 0; i < data.length; i = i + 1) {
    var pathObject = data[i];
    var propertyNames = Object.getOwnPropertyNames(pathObject);
    // Iterating the properties of the a given pathObject.
    for (var j = 0; j < propertyNames.length; j = j + 1) {
      var propertyName = propertyNames[j];
      switch (propertyName) {
        case 'securityDefinition':
        case 'securityDefinitions':
        case 'response':
        case 'responses':
        case 'parameter':
        case 'parameters':
        case 'definition':
        case 'definitions': {
          var keyName = _getSwaggerKey(propertyName);
          var definitionNames = Object
            .getOwnPropertyNames(pathObject[propertyName]);
          for (var k = 0; k < definitionNames.length; k = k + 1) {
            var definitionName = definitionNames[k];
            swaggerObject[keyName][definitionName] =
              pathObject[propertyName][definitionName];
          }
          break;
        }
        case 'tag':
        case 'tags': {
          _deprecatedPropertyWarning(propertyName);
          var tag = pathObject[propertyName];
          _attachTags({
            tag: tag,
            swaggerObject: swaggerObject,
            propertyName: propertyName,
          });
          break;
        }
        // Assumes a path property if nothing else matches.
        default: {
          swaggerObject.paths[propertyName] = _objectMerge(
            swaggerObject.paths[propertyName], pathObject[propertyName]
          );
        }
      }
    }
  }
}

module.exports = {
  addDataToSwaggerObject: addDataToSwaggerObject,
  swaggerizeObj: swaggerizeObj,
};
