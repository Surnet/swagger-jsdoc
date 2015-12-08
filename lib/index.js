/** @module index */
'use strict';


// Dependencies
var fs = require('fs');
var doctrine = require('doctrine');
var jsYaml = require('js-yaml');
var parser = require('swagger-parser');


/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {array} JSDoc comments
 * @requires doctrine
 */
function parseApiFile(file) {

  var jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  var fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  var regexResults = fileContent.match(jsDocRegex);

  var jsDocComments = [];
  if (regexResults) {
    for (var i = 0; i < regexResults.length; i = i + 1) {
      var jsDocComment = doctrine.parse(regexResults[i], { unwrap: true });
      jsDocComments.push(jsDocComment);
    }
  }

  return jsDocComments;
}


/**
 * Filters JSDoc comments for those tagged with '@swagger'
 * @function
 * @param {array} jsDocComments - JSDoc comments
 * @returns {array} JSDoc comments tagged with '@swagger'
 * @requires js-yaml
 */
function filterJsDocComments(jsDocComments) {
  var swaggerJsDocComments = [];

  for (var i = 0; i < jsDocComments.length; i = i + 1) {
    var jsDocComment = jsDocComments[i];
    for (var j = 0; j < jsDocComment.tags.length; j = j + 1) {
      var tag = jsDocComment.tags[j];
      if (tag.title === 'swagger') {
        swaggerJsDocComments.push(jsYaml.safeLoad(tag.description));
      }
    }
  }

  return swaggerJsDocComments;
}

/**
 * Merges two objects
 * @function
 * @param {object} obj1 - Object 1
 * @param {object} obj2 - Object 2
 * @returns {object} Merged Object
 */
function objectMerge(obj1, obj2) {
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
 * Adds the data in the Swagger JSDoc comments to the swagger object.
 * @function
 * @param {object} swaggerObject - Swagger object which will be written to
 * @param {array} swaggerJsDocComments - JSDoc comments tagged with '@swagger'
 */
function addDataToSwaggerObject(swaggerObject, swaggerJsDocComments) {
  for (var i = 0; i < swaggerJsDocComments.length; i = i + 1) {
    var pathObject = swaggerJsDocComments[i];
    var propertyNames = Object.getOwnPropertyNames(pathObject);
    for (var j = 0; j < propertyNames.length; j = j + 1) {
      var propertyName = propertyNames[j];
      switch (propertyName) {
        case 'definition': {
          var definitionNames = Object
            .getOwnPropertyNames(pathObject[propertyName]);
          for (var k = 0; k < definitionNames.length; k = k + 1) {
            var definitionName = definitionNames[k];
            swaggerObject.definitions[definitionName] =
              pathObject[propertyName][definitionName];
          }
          break;
        }
        default: {
          swaggerObject.paths[propertyName] = objectMerge(
            swaggerObject.paths[propertyName], pathObject[propertyName]
          );
        }
      }
    }
  }
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
    throw new Error('\'options\' is required.');
  } else /* istanbul ignore if */ if (!options.swaggerDefinition) {
    throw new Error('\'swaggerDefinition\' is required.');
  } else /* istanbul ignore if */ if (!options.apis) {
    throw new Error('\'apis\' is required.');
  }

  // Build basic swagger json
  var swaggerObject = [];
  swaggerObject = options.swaggerDefinition;
  swaggerObject.swagger = '2.0';
  swaggerObject.paths = options.swaggerDefinition.paths || {};
  swaggerObject.definitions = options.swaggerDefinition.definitions || {};

  // Parse the documentation in the APIs array.
  for (var i = 0; i < options.apis.length; i = i + 1) {
    var jsDocComments = parseApiFile(options.apis[i]);
    var swaggerJsDocComments = filterJsDocComments(jsDocComments);
    addDataToSwaggerObject(swaggerObject, swaggerJsDocComments);
  }

  parser.parse(swaggerObject, function(err, api) {
    if (!err) {
      swaggerObject = api;
    }
  });

  return swaggerObject;
};
