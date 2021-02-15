# swagger-jsdoc

This library reads your [JSDoc](https://jsdoc.app/)-annotated source code and generates an [OpenAPI (Swagger) specification](https://swagger.io/specification/).

[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
![CI](https://github.com/Surnet/swagger-jsdoc/workflows/CI/badge.svg)

```
Please be aware that 6.x of the library does not yet support ESM.
Please use commonjs export style and rename your definition files with `.cjs`.
```

## Getting started

`swagger-jsdoc` returns the validated OpenAPI specification as JSON or YAML.

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes*.js'],
};

const swaggerSpecification = swaggerJsdoc(options);
```

- `options.definition` is also acceptable. Pass an [oasObject](https://swagger.io/specification/#oasObject)
- `options.apis` are resolved with [node-glob](https://github.com/isaacs/node-glob). Construct these patterns carefully in order to reduce the number of possible matches speeding up files' discovery. Values are relative to the current working directory.

Use any of the [swagger tools](https://swagger.io/tools/) to get the benefits of your `swaggerSpecification`.

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

## Documentation

Detailed documentation is available within [`/docs`](https://github.com/Surnet/swagger-jsdoc/tree/master/docs/README.md) folder.

### Webpack integrations

- [swagger-jsdoc-webpack-plugin](https://github.com/patsimm/swagger-jsdoc-webpack-plugin) - Rebuild the swagger definition based on a predefined list of files on each webpack build.
- [swagger-jsdoc-sync-webpack-plugin](https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin) - Rebuild the swagger definition based on the files imported in your app on each webpack build.
