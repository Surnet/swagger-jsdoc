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
  return;
}

// Definition file is specified:
fs.readFile(program.definition, 'utf-8', function(err, data) {
  if (err) console.error(err);
  // Check if the definition provided can be used:
  if (data == undefined) {
    console.error('Definition file provided is not good.');
    return;
  } 
  // Check whether the definition file is actually a usable .js file
  if (path.extname(program.definition) != '.js') {
    console.error('Definition file should be a .js file.')
    return;
  }
  
});
