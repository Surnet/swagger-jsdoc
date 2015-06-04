'use strict';

var doctrine = require('doctrine'),
    express = require('express'),
    fs = require('fs'),
    jsYaml = require('js-yaml'),
    path = require('path');

// This is the Swagger object that conforms to the Swagger 2.0 specification.
module.exports.swaggerObject = {
    swagger: '2.0',
    paths: {}
};

/**
 *  Initializes the module. This is intended to be called only once.
 *  @param {object} app - Express application
 *  @param {object} options - Configuration options
 */
module.exports.init = function (app, options) {
    if (!options) {
        throw new Error('\'options\' is required.');
    }
    else if (!options.swaggerJsonPath) {
        throw new Error('\'swaggerJsonPath\' is required.');
    }
    else if (!options.swaggerUiPath) {
        throw new Error('\'swaggerUiPath\' is required.');
    }
    else if (!options.info) {
        throw new Error('\'info\' is required.');
    }
    else if (!options.info.title) {
        throw new Error('\'title\' is required.');
    }
    else if (!options.info.version) {
        throw new Error('\'version\' is required.');
    }
    else if (!options.apis) {
        throw new Error('\'apis\' is required.');
    }

    options.swaggerUiDir = options.swaggerUiDir || './swagger-ui';
    module.exports.swaggerObject.info = options.info;

    // Parse the documentation in the APIs array.
    for (var i = 0; i < options.apis.length; i++) {
        parseApiFile(options.apis[i]);
    }

    // Attach to Express routes.
    app.get(options.swaggerJsonPath, function (req, res) {
        res.json(module.exports.swaggerObject);
    });

    app.use(options.swaggerUiPath, express.static(options.swaggerUiDir));
};

// -- Parsing ----------------------------------------------------------------------------------------------------------

/**
 *  Parses the provided API file and attaches the fields to the Swagger object.
 *  @param {string} file - File to be parsed
 */
function parseApiFile(file) {
    var fileExtension = path.extname(file);
    if (fileExtension === '.js') {
        parseJsDoc(file);
    }
    else if (fileExtension === '.yml') {
        // parseYml(file);
        // TODO: Support YAML
        throw new Error('Unsupported extension \'' + fileExtension + '\'.');
    }
    else if (fileExtension === '.coffee') {
        // parseCoffee(file);
        // TODO: Support CoffeeScript
        throw new Error('Unsupported extension \'' + fileExtension + '\'.');
    }
    else {
        throw new Error('Unsupported extension \'' + fileExtension + '\'.');
    }
}

// -- JSDoc ------------------------------------------------------------------------------------------------------------

/**
 *  Parse the JSDoc comments from a JavaScript file.
 *  @param {string} file - File to parse
 */
function parseJsDoc(file) {
    var jsSourceCode = fs.readFileSync(file, { encodeing: 'utf8' });
    var jsDocComments = parseJsDocComments(jsSourceCode);
    var swaggerJsDocComments = filterSwaggerTags(jsDocComments);

    // Attach the findings to the Swagger object.
    for (var i = 0; i < swaggerJsDocComments.length; i++) {
        var pathObject = swaggerJsDocComments[i];
        module.exports.swaggerObject.paths[pathObject.path] = pathObject.operations;
    }
}

/**
 *  Parses the jsDoc comments from JavaScript source code.
 *  @param {string} sourceCode - Source code to parse
 *  @returns {array}
 */
function parseJsDocComments(jsSourceCode) {
    var jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
    var fragments = jsSourceCode.match(jsDocRegex);
    var jsDocs = [];

    if (fragments) {
        for (var i = 0; i < fragments.length; i++) {
            var fragment = fragments[i];
            var jsDoc = doctrine.parse(fragment, { unwrap: true });

            jsDocs.push(jsDoc);
        }
    }

    return jsDocs;
}

/**
 *  Filter out jsDoc comments that do not have '@swagger' tag and parses the YAML description of those that do.
 *  @param {array} jsDocs - jsDoc comments
 *  @returns {array}
 */
function filterSwaggerTags(jsDocs) {
    var swaggerJsDocs = [];
    for (var i = 0; i < jsDocs.length; i++) {
        var jsDoc = jsDocs[i];
        for (var j = 0; j < jsDoc.tags.length; j++) {
            var tag = jsDoc.tags[j];
            if (tag.title === 'swagger') {
                swaggerJsDocs.push(jsYaml.safeLoad(tag.description));
            }
        }
    }
    return swaggerJsDocs;
}

// -- YAML -------------------------------------------------------------------------------------------------------------

// -- CoffeeScript -----------------------------------------------------------------------------------------------------
