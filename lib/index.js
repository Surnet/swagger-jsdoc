/** @module index */
'use strict';


// Dependencies
var fs = require('fs');
var path = require('path');
var doctrine = require('doctrine');
var jsYaml = require('js-yaml');
var swaggerTools = require('swagger-tools');


/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {array} JSDoc comments
 * @requires doctrine
 */
function parseApiFile(file) {
  var fileExtension = path.extname(file);

  /* istanbul ignore if */
  if (fileExtension !== '.js') {
    throw new Error('Unsupported extension \'' + fileExtension + '\'.');
  }

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
      swaggerObject.paths[propertyName] = pathObject[propertyName];
    }
  }
}


// This is the Swagger object that conforms to the Swagger 2.0 specification.
module.exports.swaggerObject = [];


/**
 * Initializes the module. This is intended to be called only once.
 * @function
 * @param {object} app - Express application
 * @param {object} options - Configuration options
 * @requires swagger-tools
 */
module.exports.init = function(app, options) {
  /* istanbul ignore if */
  if (!options) {
    throw new Error('\'options\' is required.');
  } else /* istanbul ignore if */ if (!options.swaggerDefinition) {
    throw new Error('\'swaggerDefinition\' is required.');
  } else /* istanbul ignore if */ if (!options.apis) {
    throw new Error('\'apis\' is required.');
  }

  // Build basic swagger json
  module.exports.swaggerObject = options.swaggerDefinition;
  module.exports.swaggerObject.swagger = '2.0';
  module.exports.swaggerObject.paths = {};

  // Parse the documentation in the APIs array.
  for (var i = 0; i < options.apis.length; i = i + 1) {
    var jsDocComments = parseApiFile(options.apis[i]);
    var swaggerJsDocComments = filterJsDocComments(jsDocComments);
    addDataToSwaggerObject(module.exports.swaggerObject, swaggerJsDocComments);
  }

  var swaggerToolsUIOptions = {
    apiDocs: options.apiDocs,
    swaggerUi: options.swaggerUi,
  };

  // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(module.exports.swaggerObject,
    function(middleware) {
      // Interpret Swagger resources and attach metadata to request
      // must be first in swagger-tools middleware chain
      app.use(middleware.swaggerMetadata());

      // Validate Swagger requests
      app.use(middleware.swaggerValidator());

      // Route validated requests to appropriate controller
      app.use(middleware.swaggerRouter());

      // Serve the Swagger documents and Swagger UI
      app.use(middleware.swaggerUi(swaggerToolsUIOptions));
    }
  );
};
