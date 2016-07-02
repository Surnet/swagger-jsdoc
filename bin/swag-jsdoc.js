#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */
var program = require('commander');
var fs = require('fs');
var path = require('path');
var input = process.argv.slice(2);

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
  program.help();
  return;
}

// Definition file is specified:
fs.readFile(program.definition, 'utf-8', function (err, data) {
  if (err) console.error(err);
  // Check if the definition provided can be used:
  if (data == undefined) {
    console.error('Definition file provided is not good.');
    return;
  }

  // Check whether the definition file is actually a usable .js file
  if (path.extname(program.definition) != '.js' &&
    path.extname(program.definition) != '.json'
  ) {
    console.error('Definition file should be .js or .json');
    console.log('Format as a module, it will be imported with require().');
    return;
  }

  // Get an object of the definition file configuration.
  var swaggerDefinition = require(path.resolve(program.definition));

  // Check for info object in the definition.
  if (!swaggerDefinition.hasOwnProperty('info')) {
    console.error('Definition file should contain info object!');
    console.log('Read more at http://swagger.io/specification/#infoObject');
    return;
  }

  // Check for info object in the definition.
  if (!swaggerDefinition.info.hasOwnProperty('title') ||
    !swaggerDefinition.info.hasOwnProperty('version')
  ) {
    console.error('The title and version properties are required!');
    console.log('Read more at http://swagger.io/specification/#infoObject');
    return;
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
  

});
