'use strict';

var doctrine = require('doctrine');
var fs = require('fs');
var jsYaml = require('js-yaml');
var path = require('path');
var swaggerTools = require('swagger-tools');

// This is the Swagger object that conforms to the Swagger 2.0 specification.
module.exports.swaggerObject = [];



/**
 *  Parses the jsDoc comments from JavaScript source code.
 *  @param {string} sourceCode - Source code to parse
 *  @returns {array}
 */
function parseJsDoc(jsSourceCode) {
  var jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  var fragments = jsSourceCode.match(jsDocRegex);
  var jsDocs = [];

  if (fragments) {
    for (var i = 0; i < fragments.length; i = i + 1) {
      var fragment = fragments[i];
      var jsDoc = doctrine.parse(fragment, {
        unwrap: true,
      });
      jsDocs.push(jsDoc);
    }
  }

  return jsDocs;
}




/**
 * Filter out jsDoc comments that do not have '@swagger' tag
 * and parses the YAML description of those that do.
 * @param {array} jsDocs - jsDoc comments
 * @returns {array}
 */
function filterSwaggerTags(jsDocs) {
  var swaggerJsDocs = [];

  for (var i = 0; i < jsDocs.length; i = i + 1) {
    var jsDoc = jsDocs[i];
    for (var j = 0; j < jsDoc.tags.length; j = j + 1) {
      var tag = jsDoc.tags[j];
      if (tag.title === 'swagger') {
        swaggerJsDocs.push(jsYaml.safeLoad(tag.description));
      }
    }
  }

  return swaggerJsDocs;
}

/**
 *  Parse the JSDoc comments from a JavaScript file.
 *  @param {string} file - File to parse
 */
function parseJsFile(file) {
  var sourceCode = fs.readFileSync(file, {
    encoding: 'utf8',
  });
  var jsDocComments = parseJsDoc(sourceCode);
  var swaggerJsDocComments = filterSwaggerTags(jsDocComments);

  // Attach the findings to the Swagger object.
  for (var i = 0; i < swaggerJsDocComments.length; i = i + 1) {
    var paths = swaggerJsDocComments[i];
    var propertyNames = Object.getOwnPropertyNames(paths);

    for (var j = 0; j < propertyNames.length; j = j + 1) {
      var propertyName = propertyNames[j];
      module.exports.swaggerObject.paths[propertyName] = paths[propertyName];
    }
  }
}

/**
 *  Parses the provided API file and attaches the fields to the Swagger object.
 *  @param {string} file - File to be parsed
 */
function parseApiFile(file) {
  var fileExtension = path.extname(file);

  if (fileExtension === '.js') {
    parseJsFile(file);
  } else {
    throw new Error('Unsupported extension \'' + fileExtension + '\'.');
  }
}
















/**
 *  Initializes the module. This is intended to be called only once.
 *  @param {object} app - Express application
 *  @param {object} options - Configuration options
 */
module.exports.init = function(app, options) {
  if (!options) {
    throw new Error('\'options\' is required.');
  } else if (!options.swaggerDefinition) {
    throw new Error('\'swaggerDefinition\' is required.');
  } else if (!options.apis) {
    throw new Error('\'apis\' is required.');
  }

  // Build basic swagger json
  module.exports.swaggerObject = options.swaggerDefinition;
  module.exports.swaggerObject.swagger = '2.0';
  module.exports.swaggerObject.paths = {};

  // Parse the documentation in the APIs array.
  for (var i = 0; i < options.apis.length; i = i + 1) {
    parseApiFile(options.apis[i]);
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
