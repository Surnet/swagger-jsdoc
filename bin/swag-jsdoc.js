#!/usr/bin/env node
 
/**
 * Module dependencies.
 */
var program = require('commander');
var swaggerParser = require('../lib');

program
  .version('1.3.0')
  .option('-d, --definition', 'Swagger definition')
  .option('-a, --apis', 'Input files or folders with API documentation')
  .option('-o, --output', 'Output file with Swagger specification')
  .parse(process.argv);
 
program.help();