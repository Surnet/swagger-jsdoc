/* eslint import/no-extraneous-dependencies: 0 */

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const envVars = require('./envVars');
const routes = require('./routes');
const routes2 = require('./routes2');
const swaggerJSDoc = require('../..');

// Initialize express
const app = express();
app.use(bodyParser.json()); // To support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // To support URL-encoded bodies
    extended: true,
  })
);

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: {
    // API informations (required)
    title: 'Hello World', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'A sample API', // Description (optional)
  },
  host: 'localhost:3000', // Host (optional)
  basePath: '/', // Base path (optional)
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ['./example/v2/routes*.js', './example/v2/parameters.yaml'],

  // jsDocFilter has only one parameter - jsDocComment
  // jsDocComment contains the actual route jsDocumentation
  jsDocFilter: function jsDocFilter(jsDocComment) {
    // Do filtering logic here in order to determine whether
    // the JSDoc under scrunity will be displayed or not.
    // This function must return boolean. `true` to display, `false` to hide.
    const docDescription = jsDocComment.description;

    const features = docDescription.indexOf('feature') > -1;
    const featureX = docDescription.indexOf('featureX') > -1;
    const featureY = docDescription.indexOf('featureY') > -1;

    const enabledX =
      featureX && envVars && envVars.featureFilter.indexOf('X') > -1;
    const enabledY =
      featureY && envVars && envVars.featureFilter.indexOf('Y') > -1;

    const featuresEnabled = enabledX || enabledY;

    const existingRoutes = [];

    function includeDocs() {
      const route =
        jsDocComment &&
        jsDocComment.tags &&
        jsDocComment.tags[0] &&
        jsDocComment.tags[0].description &&
        jsDocComment.tags[0].description.split(':')[0];

      if (existingRoutes.indexOf(route) === -1) {
        // need to perform check if the route doc was previously added
        return true;
      }

      return false;
    }

    // featured route documentation
    if (features) {
      if (featuresEnabled) {
        return includeDocs();
      }
    } else {
      // original routes included here
      return includeDocs();
    }

    return false;
  },
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Set up the routes
routes.setup(app);
routes2.setup(app);

// Expose app
module.exports = app;

// Start the server
const server = app.listen(3000, () => {
  const host = server.address().address;
  const { port } = server.address();

  console.log('Example app listening at http://%s:%s', host, port);
});
