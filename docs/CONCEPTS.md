# Fundamental concepts

Please pay attention to the following shared information as it's based on recurring questions from the issue queue. Reading the following paragraphs carefully will save your time for the fun part: creating your API.

## Definition and `apis`

Before you start writing your specification and/or documentation, please keep in mind that there are two fundamental concepts you need to wrap you head around when working with `swagger-jsdoc` - definition object and input APIs.

Definition object maps to [OpenAPI object](https://swagger.io/specification/#oasObject) and it is a required parameter.

Input APIs are the code parts of your end specification. These could be files with JavaScript source code (or any other programming language) containing JSDoc comments. YAML files are also acceptable input and these are usually files containing definitions without logic: parameters, components, etc. The `apis` parameter is required.

The list of `apis` can be passed either as arguments of the CLI or through the `apis` option.

To illustrate with an example, given `swaggerDefinition.js`:

```javascript
module.exports = {
  info: {
    title: 'Hello World',
    version: '1.0.0',
    description: 'A sample API',
  },
};
```

One way you can make use of this definition is by the CLI:

```sh
$ swagger-jsdoc -d swaggerDefinition.js src/route*.js
```

If you prefer to skip the `apis` files selection and still use the CLI, you will need to set `apis` array containing `src/route*.js` through the options.

```javascript
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: { ... }, // could be the same definition of above
  apis: ['./src/routes*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
```

## File selection patterns

Note that `swagger-jsdoc` uses [node glob](https://github.com/isaacs/node-glob) module in the background when taking your files. This means that you can use patterns such as `*.js` to select all javascript files or `**/*.js` to select all javascript files in sub-folders recursively.

Paths provided are relative to the current directory from which you execute the program.

This concept is valid for both Node and CLI APIs.
