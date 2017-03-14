# swagger-jsdoc

**swagger-jsdoc** enables to integrate [Swagger](http://swagger.io) using JSDoc.

[![npm Version](https://img.shields.io/npm/v/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)

[![Circle CI](https://img.shields.io/circleci/project/Surnet/swagger-jsdoc/master.svg)](https://circleci.com/gh/Surnet/swagger-jsdoc)
[![Dependency Status](https://img.shields.io/gemnasium/Surnet/swagger-jsdoc.svg)](https://gemnasium.com/Surnet/swagger-jsdoc)
[![Documentation Status](http://inch-ci.org/github/Surnet/swagger-jsdoc.svg?branch=master&style=flat)](http://inch-ci.org/github/Surnet/swagger-jsdoc)
[![Known Vulnerabilities](https://snyk.io/test/npm/swagger-jsdoc/badge.svg)](https://snyk.io/test/npm/swagger-jsdoc)

## Supported Swagger Versions
* 2.0

## Install

```bash
$ npm install swagger-jsdoc --save
```

### Quick Start

swagger-jsdoc returns the validated swagger specification as JSON.

```javascript
var swaggerJSDoc = require('swagger-jsdoc');

var options = {
  swaggerDefinition: {
    info: {
      title: 'Hello World', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  apis: ['./routes.js'], // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);
```

At this time you can do with the swaggerSpec whatever you want.
The simplest way would be serving it straight to the outside world:

```javascript
app.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
```

You could also use a framework like [swagger-tools](https://www.npmjs.com/package/swagger-tools) to serve the spec and a swagger-ui.

### How to document the API

The API can now be documented in JSDoc-style with swagger spec in YAML.

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
In place of writing (or copy and pasting) the same code into multiple locations,
which can be error prone when adding a new field to the schema. You can define
a model and re-use it across multiple endpoints. You can also reference another
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
    res.json([ {
      id: 1,
      username: 'jsmith',
    }, {1
      id: 2,
      username: 'jdoe',
    } ]);
  });

  /**
   * @swagger
   * /users:
   *   post:
   *     description: Returns users
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
    req.body.id = Math.floor(Math.random() * 100) * 1
    res.json(req.body);
  });
```

### Load external definitions

You can load external definitions or paths after ``swaggerJSDoc()`` function.
```javascript
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);
// load external schema json
swaggerSpec.definitions.in_login = require("config/schemajson/in.login.schema.json");
swaggerSpec.definitions.out_login = require("config/schemajson/out.login.schema.json");
// or set manual paths
swaggerSpec.paths["api/v1/cool"] = {"get" : { ... } }
};
```



## Example App

There is an example app in the example subdirectory.
To use it you can use the following commands:

```bash
$ git clone https://github.com/Surnet/swagger-jsdoc.git
$ cd swagger-jsdoc
$ npm install
$ npm start
```

The swagger spec will be served at http://localhost:3000/api-docs.json


### Using a CLI

If the module is installed globally, a command line helper `$ swagger-jsdoc` will be available.
Otherwise `./bin/swagger-jsdoc` accesses to the same interface.

Common usage:

- Help menu: `./bin/swagger-jsdoc -h`
- Specify a swagger definition file: `./bin/swagger-jsdoc -d example/swaggerDef.js` - could be any .js or .json file which will be `require()`-ed and parsed/validated as JSON.
- Specify files with documentation: `./bin/swagger-jsdoc example/routes.js example/routes2.js` - free form input, can be before or after definition
- Specify output file (optional): `./bin/swagger-jsdoc -o output.json` - swagger.json will be created if this is not set.
If specifying an output file with a `.yaml` or `.yml` extension, the swagger spec will automatically be saved in YAML format instead of JSON.
- Watch for changes: `./bin/swagger-jsdoc -d example/swaggerDef.js example/routes.js example/routes2.js -w` - start a watch task for input files with API documentation.
This may be particularly useful when the output specification file is integrated with [Browsersync](https://browsersync.io/)
and [Swagger UI](http://swagger.io/swagger-ui/). Thus, the developer updates documentation in code with fast feedback in an
interface showing an example of live documentation based on the swagger specification.
Read [this article](https://medium.com/@kalin.chernev/agile-documentation-for-your-api-driven-project-based-on-open-api-standards-11e54d4326bb#.2p8pw7ini) for further details.
