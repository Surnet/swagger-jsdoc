#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */
var program = require('commander');
var fs = require('fs');
var path = require('path');
var swaggerJSDoc = require('../');

// Useful input.
var input = process.argv.slice(2);
var output = 'swaggerSpec.json';

program
  .version('1.3.0')
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
  console.error('Definition file is required.');
  console.log('You can do that, for example: ');
  console.log('$ swag-jsdoc -d swaggerDef.js ' + input.join(' '));
  return program.help();
}

// Override default output file if provided.
if (program.output) {
  output = program.output;
}

// Definition file is specified:
fs.readFile(program.definition, 'utf-8', function (err, data) {
  if (err || data == undefined) {
    return console.error('Definition file provided is not good.');
  }

  // Check whether the definition file is actually a usable .js file
  if (path.extname(program.definition) != '.js' &&
    path.extname(program.definition) != '.json'
  ) {
    console.log('Format as a module, it will be imported with require().');
    return console.error('Definition file should be .js or .json');
  }

  // Get an object of the definition file configuration.
  var swaggerDefinition = require(path.resolve(program.definition));

  // Check for info object in the definition.
  if (!swaggerDefinition.hasOwnProperty('info')) {
    console.error('Definition file should contain info object!');
    return console.log('Read more at http://swagger.io/specification/#infoObject');
  }

  // Check for info object in the definition.
  if (!swaggerDefinition.info.hasOwnProperty('title') ||
    !swaggerDefinition.info.hasOwnProperty('version')
  ) {
    console.error('The title and version properties are required!');
    return console.log('Read more at http://swagger.io/specification/#infoObject');
  }

  // Aggregate information about APIs.
  if (program.args.length) {
    // Iterate arguments and figure out which is what.
    var apis = [];
    program.args.forEach(function (argument) {
      // Try to resolve the argument:
      var result = fs.lstatSync(path.resolve(argument));
      if (result) {
        if (result.isFile() || result.isDirectory()) {
          apis.push(argument);
        }
      }
    });
  }

  // Options for the swagger docs
  var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: apis,
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  var swaggerSpec = swaggerJSDoc(options);

  // Create the output file with swagger specification.
  fs.writeFile(output, JSON.stringify(swaggerSpec, null, 2), function (err) {
    if (err) throw err;
    console.log('Swagger specification created successfully.');
  });

});
