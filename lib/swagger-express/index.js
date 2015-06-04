'use strict';

var express = require('express');

// This is the Swagger object that conforms to the Swagger 2.0 specification.
module.exports.swaggerObject = {
    swagger: '2.0'
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

// ---------------------------------------------------------------------------------------------------------------------

/**
 *  Parses the provided API file and attaches the fields to the Swagger object.
 *  @param {string} file - File to be parsed
 */
function parseApiFile(file) {

}
