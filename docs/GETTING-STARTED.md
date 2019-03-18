## Getting started

`swagger-jsdoc` returns the validated OpenAPI specification as JSON or YAML.

```javascript
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Hello World', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: ['./routes.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = await swaggerJSDoc(options);
```

Notes:

- `options.definition` could be also `options.swaggerDefinition`
- paths given in `options.apis` are resolved with [node-glob](https://github.com/isaacs/node-glob) in the background. Try to limit your patterns smartly to speed up discovery of files.
- relative paths in `apis` are relative to the current directory from which the Node.js program is ran, not the application serving the APIs.

At this time you can do with the `swaggerSpec` whatever you want.
The simplest way would be serving it straight to the outside world:

```javascript
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
```

You could also use a framework like [swagger-tools](https://www.npmjs.com/package/swagger-tools) to serve the spec and a `swagger-ui`.

### How to document the API

The API can be documented in JSDoc-style with swagger spec in YAML.

```javascript
/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
app.post('/login', (req, res) => {
  // Your implementation comes here ...
});
```

### Re-using Model Definitions

A model may be the same for multiple endpoints: `POST`, `PUT` responses, etc.

Duplicating parts of your code into multiple locations is error prone and requires more attention when maintaining your code base. To solve these, you can define a model and re-use it across multiple endpoints. You can also reference another model and add fields.

```javascript
/**
 * @swagger
 *
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

/**
 * @swagger
 * /users:
 *   get:
 *     description: Returns users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
app.get('/users', (req, res) => {
  // Your implementation logic comes here ...
});

/**
 * @swagger
 *
 * /users:
 *   post:
 *     description: Creates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           $ref: '#/definitions/User'
 */
app.post('/users', (req, res) => {
  // Your implementation logic comes here ...
});
```

Keep in mind that since v3 of the specification, you can use [components](https://swagger.io/docs/specification/components/) in order to define and reuse resources.
