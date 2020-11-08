# swagger-jsdoc

Document your code and keep a live and reusable OpenAPI (Swagger) specification. This specification can be the core of your API-driven project: generate
documentation, servers, clients, tests and much more based on the rich [OpenAPI ecosystem of tools](http://swagger.io/).

[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
![CI](https://github.com/Surnet/swagger-jsdoc/workflows/CI/badge.svg)

## Goals

**swagger-jsdoc** enables you to integrate [Swagger](http://swagger.io)
using [`JSDoc`](https://jsdoc.app/) comments in your code. Just add `@swagger` (or `@openapi`) on top of your DocBlock and declare the meaning of your code in YAML complying to the OpenAPI specification. If you prefer to keep some parts of your specification aside your code in order to keep it lighter/cleaner, you can also pass these parts as separate input YAML files.

`swagger-jsdoc` will parse the above-mentioned and output an OpenAPI specification. You can use it to integrate any server and client technology as long as both sides comply with the specification.

Thus, the `swagger-jsdoc` project assumes that you want document your existing/living/working code in a way to "give life" to it, generating a specification which can then be fed into other Swagger tools, and not the vice-versa.

If you prefer to write the OpenAPI specification first and separately, you might check other projects facilitating this, such as

- [swagger-editor](http://swagger.io/swagger-editor/)
- [swagger-node](https://github.com/swagger-api/swagger-node)

### Webpack integration

You can use this package with a webpack plugin to keep your swagger documentation up-to-date when building your app:

- [swagger-jsdoc-webpack-plugin](https://github.com/patsimm/swagger-jsdoc-webpack-plugin) - Rebuild the swagger definition based on a predefined list of files on each webpack build.
- [swagger-jsdoc-sync-webpack-plugin](https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin) - Rebuild the swagger definition based on the files imported in your app on each webpack build.

## Supported versions

- OpenAPI 3.x
- Swagger 2.0

To make sure your end specification is valid, do read the most up-to date official [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification).

## Installation

```bash
$ npm install swagger-jsdoc --save
```

Or using [`yarn`](https://yarnpkg.com/en/)

```bash
$ yarn add swagger-jsdoc
```

### Fundamental concepts

Before you start writing your specification and/or documentation, please keep in mind that there are two fundamental concepts you need to wrap your head around when working with `swagger-jsdoc` - definition object and input APIs.

Definition object maps to [OpenAPI object](https://swagger.io/specification/#oasObject). This is where you would add information about your API and any root-level properties. Definition object is a required parameter.

Input APIs are any files which you pass as arguments to the program in order to extract information about your API. For instance, these could be `.js` files with JSDoc comments or `.yaml` files directly. This parameter is also required.

There are a few ways by which you can pass these 2 required arguments:

When using the CLI:

- Through `apis` property in your definition object.
- Through arguments

When using the Node API:

- Through `apis` in your `options` object.

For example, given the following module export for a definition object:

```javascript
// Taken from example/v2/swaggerDef.js

module.exports = {
  info: {
    // API informations (required)
    title: 'Hello World', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'A sample API', // Description (optional)
  },
  host, // Host (optional)
  basePath: '/', // Base path (optional)
};
```

One way you can make use of this definition is by using the CLI as following:

```sh
$ swagger-jsdoc -d example/v2/swaggerDef.js example/v2/route*.js
```

If you, however, want to skip the arguments and still use the CLI, you will need to update the definition object as following:

```javascript
// Taken from example/v2/swaggerDef.js

module.exports = {
  ...
  apis: ['example/v2/route*.js'] // <-- We add this property:
  basePath: '/', // Base path (optional)
};
```

And then you will be able to use the CLI as following:

```sh
$ swagger-jsdoc -d example/v2/swaggerDef.js
```

When using the Node API, input APIs come in in the following way:

```javascript
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  ...
  basePath: '/', // Base path (optional)
};

const options = {
  swaggerDefinition,
  apis: ['./example/v2/routes*.js'], // <-- not in the definition, but in the options
};

const swaggerSpec = swaggerJSDoc(options);
```

### Quick Start

[Get started](./docs/GETTING-STARTED.md) by documenting your code.

Note that `swagger-jsdoc` uses [node glob](https://github.com/isaacs/node-glob) module in the background when taking your files. This means that you can use patterns such as `*.js` to select all javascript files or `**/*.js` to select all javascript files in sub-folders recursively.

Paths provided are relative to the current directory from which you execute the program.

### Examples

There are plenty of examples you can use to start off:

- `example`: contains an example app with version 2 of the specification. It will give you an idea how to annotate your comments in order to include them in the output specification.
- `test/cli`: CLI tests you can read to get ideas about the available functionalities of the CLI. (apart from the obvious help menu)
- `test/example`: various assets for tests you can also re-use for starting definitions, routes, etc.

### CLI

On top of the Node API, there is also a [command line interface](./docs/CLI.md).

### Reporting issues

Before submitting new issues, please make sure you first search for existing such. It is quite possible that the topic you would like to bring up has been discussed already.

In case of an issue which hasn't been considered yet, please include as much information as possible about the issue. This will help maintainers and other users relate to your problem at hand.

For instance:

- Describe what you were doing when the issue appeared.
- Add a set of steps to reproduce your issue.
- Include screenshots.
- Give examples on expected vs actual behavior.

### Contributing

- Fork the project and clone it locally.
- Create branches for each separate topic. Any standard you are used to follow for [semantic commit messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) will be highly appreciated.
- Comment your code as if you are going to maintain it in the future.
- Use the rich set of unit tests as an example and add your unit tests as well. This will not only enable you to programatically reproduce your fix faster than setting up an application, but it will also make you super cool! :)
- Push to your changes to the origin of your repository and create a new pull request towards the upstream master.

Thank you!
