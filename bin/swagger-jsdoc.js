#!/usr/bin/env node

/**
 * Module dependencies.
 */
const program = require('commander');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const swaggerJSDoc = require('../');
const pkg = require('../package.json');

// Useful input.
const input = process.argv.slice(2);
// The spec, following a convention.
let output = 'swagger.json';

/**
 * Creates a swagger specification from a definition and a set of files.
 * @function
 * @param {object} swaggerDefinition - The swagger definition object.
 * @param {array} apis - List of files to extract documentation from.
 * @param {string} fileName - Name the output file.
 */
function createSpecification(swaggerDefinition, apis, fileName) {
  // Options for the swagger docs
  const options = {
    // Import swaggerDefinitions
    swaggerDefinition,
    // Path to the API docs
    apis,
  };

  // Initialize swagger-jsdoc -> returns validated JSON or YAML swagger spec
  let swaggerSpec;
  const ext = path.extname(fileName);

  if (ext === '.yml' || ext === '.yaml') {
    swaggerSpec = jsYaml.dump(swaggerJSDoc(options), {
      schema: jsYaml.JSON_SCHEMA,
      noRefs: true,
    });
  } else {
    swaggerSpec = JSON.stringify(swaggerJSDoc(options), null, 2);
  }

  fs.writeFile(fileName, swaggerSpec, err => {
    if (err) {
      throw err;
    }
    console.log('Swagger specification is ready.');
  });
}

program
  .version(pkg.version)
  .usage('[options] <path ...>')
  .option('-d, --definition <swaggerDef.js>', 'Input swagger definition.')
  .option('-o, --output [swaggerSpec.json]', 'Output swagger specification.')
  .parse(process.argv);

// If no arguments provided, display help menu.
if (!input.length) {
  program.help();
}

// Require a definition file
if (!program.definition) {
  console.log('Definition file is required.');
  console.log('You can do that, for example: ');
  console.log(`$ swag-jsdoc -d swaggerDef.js ${input.join(' ')}`);
  program.help();
  process.exit(1);
}

// Override default output file if provided.
if (program.output) {
  // eslint-disable-next-line prefer-destructuring
  output = program.output;
}

// Definition file is specified:
fs.readFile(program.definition, 'utf-8', (err, data) => {
  if (err || data === undefined) {
    return console.log('Definition file provided is not good.');
  }

  // Check whether the definition file is actually a usable .js file
  if (
    path.extname(program.definition) !== '.js' &&
    path.extname(program.definition) !== '.json'
  ) {
    console.log('Format as a module, it will be imported with require().');
    return console.log('Definition file should be .js or .json');
  }

  // Get an object of the definition file configuration.
  // eslint-disable-next-line
  const swaggerDefinition = require(path.resolve(program.definition));

  // Check for info object in the definition.
  if (!('info' in swaggerDefinition)) {
    console.log('Definition file should contain an info object!');
    return console.log('More at http://swagger.io/specification/#infoObject');
  }

  // Check for title and version properties in the info object.
  if (
    !('title' in swaggerDefinition.info) ||
    !('version' in swaggerDefinition.info)
  ) {
    console.log('The title and version properties are required!');
    return console.log('More at http://swagger.io/specification/#infoObject');
  }

  // Continue only if arguments provided.
  if (!swaggerDefinition.apis && !program.args.length) {
    console.log('You must provide sources for reading API files.');
    // jscs:disable maximumLineLength
    return console.log(
      'Either add filenames as arguments, or add an "apis" key in your definitions file.'
    );
  }

  // If there's no argument passed, but the user has defined Apis in
  // the definition file, pass them them onwards.
  if (
    program.args.length === 0 &&
    swaggerDefinition.apis &&
    swaggerDefinition.apis instanceof Array
  ) {
    program.args = swaggerDefinition.apis;
  }

  return createSpecification(swaggerDefinition, program.args, output);
});
