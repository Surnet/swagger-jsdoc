/* istanbul ignore file */

import express from 'express';
import bodyParser from 'body-parser';
import { setup as setupRoute1 } from './routes.js';
import { setup as setupRoute2 } from './routes2.js';
import swaggerJsdoc from 'swagger-jsdoc';

async function surveSwaggerSpecification(req, res) {
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
    apis: ['./routes*.js', './parameters.yaml'],
  };
  const swaggerSpec = await swaggerJsdoc(options);

  // And here we go, we serve it.
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
}

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

app.get('/api-docs.json', surveSwaggerSpecification);

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
