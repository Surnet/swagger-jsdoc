const express = require('express');
const swaggerJSDoc = require('../..');

const port = process.env.PORT || 3000;
const app = express();

/**
 * @swagger
 * '/helloworld':
 *   get:
 *     summary: The helloworld API
 *     description: This is a description.
 *     security: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelloWorld'
 *     x-amazon-apigateway-integration: *default-integration
 */
app.get('/', () => {});

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AWS API Gateway',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: ['**/*.js', '**/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/api', (req, res) => {
  res.send(swaggerSpec);
});

app.listen(port, () => console.log(`http://localhost:${port}`));
