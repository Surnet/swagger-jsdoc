---
sidebar_position: 1
title: Intro
---

# swagger-jsdoc

This library reads your [JSDoc](https://jsdoc.app/)-annotated source code and generates an [OpenAPI (Swagger) specification](https://swagger.io/specification/).

[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
![CI](https://github.com/Surnet/swagger-jsdoc/workflows/CI/badge.svg)

## Getting started

Imagine having API files like these:

```javascript
/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```

The library will take the contents of `@openapi` (or `@swagger`) with the following configuration:

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
```

The resulting `openapiSpecification` will be a [swagger tools](https://swagger.io/tools/)-compatible (and validated) specification.

![swagger-jsdoc example screenshot](/img/screenshot.png)

## System requirements

- Node.js 12.x or higher

You are viewing `swagger-jsdoc` v6 which is published in CommonJS module system.

## Installation

```bash
npm install swagger-jsdoc --save
```

Or

```bash
yarn add swagger-jsdoc
```

## Supported specifications

- OpenAPI 3.x
- Swagger 2
- AsyncAPI 2.0

## Validation of swagger docs

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

## Documentation

Click on the version you are using from navigation bar for further details.
