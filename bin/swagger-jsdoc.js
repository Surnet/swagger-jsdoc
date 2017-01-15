#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

var program = require('commander');
var fs = require('fs');
var path = require('path');
var swaggerJSDoc = require('../');
var pkg = require('../package.json');
var chokidar = require('chokidar');

// Useful input.
var input = process.argv.slice(2);
// The spec, following a convention.
var output = 'swagger.json';

// No-cache module loading.
function requireNoCache(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

/**
 * Creates a swagger specification from a definition and a set of files.
 * @function
 * @param {object} swaggerDefinition - The swagger definition object.
 * @param {array} apis - List of files to extract documentation from.
 * @param {array} output - Name the output file.
 */
function createSpecification(swaggerDefinition, apis, output) {
  // Options for the swagger docs
  var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: apis,
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  var swSpec = swaggerJSDoc(options);

  fs.writeFile(output, JSON.stringify(swSpec, null, 2), function(err) {
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
  .option('-w, --watch', 'Whether or not to listen for continous changes.')
  .parse(process.argv);

// If no arguments provided, display help menu.
if (!input.length) {
  program.help();
}

// Require a definition file
if (!program.definition) {
  console.log('Definition file is required.');
  console.log('You can do that, for example: ');
  console.log('$ swag-jsdoc -d swaggerDef.js ' + input.join(' '));
  program.help();
  process.exit(1);
}

// Override default output file if provided.
if (program.output) {
  output = program.output;
}

// Definition file is specified:
fs.readFile(program.definition, 'utf-8', function(err, data) {
  if (err || data === undefined) {
    return console.log('Definition file provided is not good.');
  }

  // Check whether the definition file is actually a usable .js file
  if (path.extname(program.definition) !== '.js' &&
    path.extname(program.definition) !== '.json'
  ) {
    console.log('Format as a module, it will be imported with require().');
    return console.log('Definition file should be .js or .json');
  }

  // Get an object of the definition file configuration.
  var swaggerDefinition = requireNoCache(path.resolve(program.definition));

  // Check for info object in the definition.
  if (!swaggerDefinition.hasOwnProperty('info')) {
    console.log('Definition file should contain an info object!');
    return console.log('More at http://swagger.io/specification/#infoObject');
  }

  // Check for title and version properties in the info object.
  if (!swaggerDefinition.info.hasOwnProperty('title') ||
    !swaggerDefinition.info.hasOwnProperty('version')
  ) {
    console.log('The title and version properties are required!');
    return console.log('More at http://swagger.io/specification/#infoObject');
  }

  // Continue only if arguments provided.
  if (!program.args.length) {
    return console.log('You must provide arguments for reading APIs.');
  }

  // If watch flag is turned on, listen for changes.
  if (program.watch) {
    var watcher = chokidar.watch([program.definition, program.args], {
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    });

    watcher.on('ready', function startMessage() {
      console.log('Listening for changes ...');
    });

    watcher.on('change', function detectChange(path) {
      console.log('Change detected in ' + path);
    });

    watcher.on('error', function catchErr(err) {
      return console.error(err);
    });

    watcher.on('all', function regenerateSpec() {
      createSpecification(swaggerDefinition, program.args, output);
    });
  }
  // Just create the specification.
  else {
    createSpecification(swaggerDefinition, program.args, output);
  }
});
