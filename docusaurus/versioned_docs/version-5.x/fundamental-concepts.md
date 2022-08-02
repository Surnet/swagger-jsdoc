---
sidebar_position: 3
title: Fundamental Concepts
---

# Fundamental concepts

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
