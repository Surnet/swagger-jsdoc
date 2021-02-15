# swagger-jsdoc

This library reads your [JSDoc](https://jsdoc.app/)-annotated source code and generates an [OpenAPI (Swagger) specification](https://swagger.io/specification/).

[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
![CI](https://github.com/Surnet/swagger-jsdoc/workflows/CI/badge.svg)

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

## Node.js version requirements, CommonJS and ESM

`swagger-jsdoc` 6.x requires Node.js 12.x and above. When using the CLI, the library will attempt to load the definition file in several formats: `.js`, `.cjs`, `.yaml` (or `.yml`) and `.json`.

The example above follows the CommonJS format, which will work when you do not have `"type": "module"` in your `package.json`.

However, if you're using ESM and have `"type": "module"`, then please change the extension to `.cjs`.

Definition files in `.js` and ESM will be supported in `swagger-jsdoc` 7.x.

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
