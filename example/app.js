'use strict';

// Dependencies
var express = require('express'),
    routes = require('./routes'),
    swagger = require('../');

// Initialize express
var app = express();

// Swagger definition (https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#schema)
var swaggerDefinition = {
    info: { // API informations (required)
        title: 'Hello World', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'A sample API' // Description (optional)
    },
    host: "localhost:3000", // Host (optional)
    basePath: "/" // Base path (optional)
}

// Options for the swagger docs
var options = {
    apiDocs: '/api-docs.json', // Path to the apiDocs JSON-File (default: '/api-docs', optional)
    swaggerUi: '/docs', // Path to the swaggerUI (default: '/docs', optional)
    swaggerDefinition: swaggerDefinition, // Import swaggerDefinitions
    apis: ['./routes.js'] // Path to the API docs
};

// Initialize jsdoc-express-with-swagger
swagger.init(app, options);

// Set up the routes
routes.setup(app);

// Start the server
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});