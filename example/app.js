'use strict';


// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var swaggerTools = require('swagger-tools');
var routes = require('./routes');
var swaggerJSDoc = require('../');


// Initialize express
var app = express();
app.use(bodyParser.json()); // To support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // To support URL-encoded bodies
  extended: true,
}));


// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
var swaggerDefinition = {
  info: { // API informations (required)
    title: 'Hello World', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'A sample API', // Description (optional)
  },
  host: 'localhost:3000', // Host (optional)
  basePath: '/', // Base path (optional)
};


// Options for the swagger docs
var options = {
  swaggerDefinition: swaggerDefinition, // Import swaggerDefinitions
  apis: ['./example/routes.js'], // Path to the API docs
};


// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);


// Swagger Tools Options
var swaggerToolsUIOptions = {
  apiDocs: '/api-docs.json',
  swaggerUi: '/docs',
};


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerSpec,
  function(middleware) {
    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi(swaggerToolsUIOptions));
  }
);


// Set up the routes
routes.setup(app);


// Expose app
exports = module.exports = app;


// Start the server
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});