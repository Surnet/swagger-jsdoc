# swagger-jsdoc

**swagger-jsdoc** enables to integrate [Swagger](http://swagger.io) using JSDoc.

[![npm Version](https://img.shields.io/npm/v/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
[![Donate](https://img.shields.io/gratipay/Surnet.svg)](https://gratipay.com/Surnet)

[![Circle CI](https://img.shields.io/circleci/project/Surnet/swagger-jsdoc/master.svg)](https://circleci.com/gh/Surnet/swagger-jsdoc)
[![Codacy Badge](https://img.shields.io/codacy/c5d3d458d11a4fb88b55cd527b1c708f.svg)](https://www.codacy.com/app/Surnet/swagger-jsdoc)
[![Dependency Status](https://img.shields.io/gemnasium/Surnet/swagger-jsdoc.svg)](https://gemnasium.com/Surnet/swagger-jsdoc)
[![Documentation Status](http://inch-ci.org/github/Surnet/swagger-jsdoc.svg?branch=master&style=flat)](http://inch-ci.org/github/Surnet/swagger-jsdoc)

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
  models:['./user.js'] //Path to the model definitions
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