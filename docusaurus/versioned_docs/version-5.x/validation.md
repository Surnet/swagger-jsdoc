---
sidebar_position: 7
title: Validation
---

# Validation

By default `swagger-jsdoc` tries to parse all docs to it's best capabilities. If you'd like to you can instruct an Error to be thrown instead if validation failed by setting the options flag `failOnErrors` to `true`. This is for instance useful if you want to verify that your swagger docs validate using a unit test.

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes*.js'],
};
const openapiSpecification = swaggerJsdoc(options);
```
