#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */
var program = require('commander');

program
  .version('1.3.0')
  .option('-d, --definition', 'Swagger definition')
  .option('-a, --apis', 'Input files or folders with API documentation')
  .option('-o, --output', 'Output file with Swagger specification')
  .parse(process.argv);

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
}
