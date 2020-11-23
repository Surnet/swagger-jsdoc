#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const YAML = require('yaml');

const swaggerJsdoc = require('..');
const pkg = require('../package.json');

const input = process.argv.slice(2);
let output = 'swagger.json';

/**
 * Get an object of the definition file configuration.
 * @param {string} defPath
 * @param {object} swaggerDefinition
 */
function loadDefinition(defPath, swaggerDefinition) {
  const resolvedPath = path.resolve(defPath);
  const extName = path.extname(resolvedPath);

  // eslint-disable-next-line
  const loadJs = () => require(resolvedPath);
  const loadJson = () => JSON.parse(swaggerDefinition);
  const loadYaml = () => YAML.parse(swaggerDefinition);

  const LOADERS = {
    '.js': loadJs,
    '.json': loadJson,
    '.yml': loadYaml,
    '.yaml': loadYaml,
  };

  const loader = LOADERS[extName];

  if (loader === undefined) {
    throw new Error('Definition file should be .js, .json, .yml or .yaml');
  }

  return loader();
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

  let swaggerDefinition;

  try {
    swaggerDefinition = loadDefinition(program.definition, data);
  } catch (error) {
    const message = `Error while loading definition file '${program.definition}':\n${error.message}`;
    return console.log(message);
  }

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
    return console.log(
      'Either add filenames as arguments, or add an "apis" key in your definitions file.'
    );
  }

  fs.writeFileSync(
    output,
    JSON.stringify(
      swaggerJsdoc({
        swaggerDefinition,
        apis: swaggerDefinition.apis || program.args,
      }),
      null,
      2
    )
  );

  return console.log('Swagger specification is ready.');
});
