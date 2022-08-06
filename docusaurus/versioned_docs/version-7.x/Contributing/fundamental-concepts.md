---
sidebar_position: 5
---

# Fundamental concepts

Please pay attention to the following shared information as it's based on recurring questions from the issue queue. Reading the following paragraphs carefully will save your time for the fun part: creating your API.

## Definition and `apis`

There are two fundamental concepts in `swagger-jsdoc` - definition object and input APIs.

The definition object maps to [OpenAPI object](https://swagger.io/specification/#oasObject) and the input APIs are split source code parts which form the end specification.

Parts of the specification can be placed in annotated JSDoc comments in non-compiled logical files. These specification parts stand close to their implementation.

Other parts of the specification can be directly written in YAML files. These are usually parts containing static definitions which are referenced from jsDoc comments parameters, components, anchors, etc. which are not so relevant to the API implementation.

Given the following definition `swaggerDefinition.cjs`:

```javascript
module.exports = {
  info: {
    title: 'Hello World',
    version: '1.0.0',
    description: 'A sample API',
  },
};
```

The end `swaggerSpecification` will be a result of following:

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swaggerDefinition');

const options = {
  swaggerDefinition,
  apis: ['./src/routes*.js'],
};

const swaggerSpecification = swaggerJsdoc(options);
```

## File selection patterns

`swagger-jsdoc` uses [node glob](https://github.com/isaacs/node-glob) for discovering your input files. You can use patterns such as `*.js` to select all javascript files or `**/*.js` to select all javascript files in sub-folders recursively.

Paths are relative to the current working directory.

[Tests](https://github.com/Surnet/swagger-jsdoc/tree/v6/test)
