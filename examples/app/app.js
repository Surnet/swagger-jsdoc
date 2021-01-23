/* istanbul ignore file */
/* eslint import/no-extraneous-dependencies: 0 */

// Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { setup as setupRoute1 } from './routes.js';
import { setup as setupRoute2 } from './routes2.js';
import swaggerJsdoc from '../../src/lib.js';

const PORT = process.env.PORT || 3000;

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
  host: `localhost:${PORT}`, // Host (optional)
  basePath: '/', // Base path (optional)
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./examples/app/routes*.js', './examples/app/parameters.yaml'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJsdoc(options);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Set up the routes
setupRoute1(app);
setupRoute2(app);

// Start the server
const server = app.listen(PORT, () => {
  const host = server.address().address;
  const { port } = server.address();

  console.log('Example app listening at http://%s:%s', host, port);
});

export { app, server };
