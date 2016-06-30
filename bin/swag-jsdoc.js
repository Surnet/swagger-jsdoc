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

// No swagger definition file provided by input.
if (program.args.length) {
  console.log(program.args);
  console.log(program.apis);
//   fs.readdir(folder, function(err, files) {
// if (err) throw Error(err);
// files.forEach(function(file){
//   var fileExtension = path.extname(file);
//   if ((fileExtension.substring(1, fileExtension.length)) == extension) {
//     console.log(file);
//   }
// });
// });
}