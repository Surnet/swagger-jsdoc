## Getting started

`swagger-jsdoc` returns the validated OpenAPI specification as JSON or YAML.

```javascript
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    info: {
      title: 'Hello World', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: ['./routes.js'],
};

Please note that relative paths in `apis` are relative to the current directory from which the Node.js program is ran, not the application serving the APIs.

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
```

Notes:

- `options.definition` could be also `options.swaggerDefinition`
- paths given in `options.apis` are resolved with [node-glob](https://github.com/isaacs/node-glob) in the background. Try to limit your patterns smartly to speed up discovery of files.

At this time you can do with the `swaggerSpec` whatever you want.
The simplest way would be serving it straight to the outside world:

```javascript
app.get('/api-docs.json', function(req, res) {
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
app.post('/login', function(req, res) {
  res.json(req.body);
});
```

### Re-using Model Definitions

A model may be the same for multiple endpoints (Ex. User POST,PUT responses).

In place of writing (or copy and pasting) the same code into multiple locations, which can be error prone when adding a new field to the schema. You can define a model and re-use it across multiple endpoints. You can also reference another
model and add fields.

```javascript
/**
 * @swagger
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
app.get('/users', function(req, res) {
  res.json([
    {
      id: 1,
      username: 'jsmith',
    },
    {
      id: 2,
      username: 'jdoe',
    },
  ]);
});

/**
 * @swagger
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
app.post('/users', function(req, res) {
  // Generate ID
  req.body.id = Math.floor(Math.random() * 100) * 1;
  res.json(req.body);
});
```

Keep in mind that since v3 of the specification, you can use [components](https://swagger.io/docs/specification/components/) in order to definite and reuse resources.

### Load external definitions

You can load external definitions or paths after `swaggerJSDoc()` function.

```javascript
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);
// load external schema json
swaggerSpec.definitions.in_login = require("config/schemajson/in.login.schema.json");
swaggerSpec.definitions.out_login = require("config/schemajson/out.login.schema.json");
// or set manual paths
swaggerSpec.paths["api/v1/cool"] = {"get" : { ... } }
```

If you need more examples, feel free to browse the repository and its tests and examples.
