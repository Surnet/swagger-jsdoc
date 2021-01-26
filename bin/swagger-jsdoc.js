#!/usr/bin/env node

import { extname } from 'path';
import { createRequire } from 'module';
import { writeFile } from 'fs/promises';
import program from 'commander';

import swaggerJsdoc from '../src/lib.js';
import { loadDefinition } from '../src/utils.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const executeBinary = async () => {
  program
    .version(pkg.version)
    .usage('[options] <path ...>')
    .option(
      '-d, --definition <swaggerDefinition.js>',
      'Input swagger definition.'
    )
    .option('-o, --output [swaggerSpec.json]', 'Output swagger specification.')
    .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.help();
  }

  const { definition, output } = program;

  if (!definition) {
    console.log('Definition file is required.');
    program.help();
  }

  try {
    const swaggerDefinition = await loadDefinition(definition);

    if (!('info' in swaggerDefinition)) {
      console.log('Definition file should contain an info object!');
      console.log('More at http://swagger.io/specification/#infoObject');
      process.exit();
    }

    if (
      !('title' in swaggerDefinition.info) ||
      !('version' in swaggerDefinition.info)
    ) {
      console.log('The title and version properties are required!');
      console.log('More at http://swagger.io/specification/#infoObject');
      process.exit();
    }

    if (!program.args.length) {
      console.log('Input files are required!');
      console.log(
        'More at https://github.com/Surnet/swagger-jsdoc/blob/master/docs/CLI.md#input-files'
      );
      process.exit();
    }

    await writeFile(
      output || 'swagger.json',
      JSON.stringify(
        swaggerJsdoc({
          swaggerDefinition,
          apis: program.args,
          format: extname(output || ''),
        }),
        null,
        2
      )
    );

    console.log('Swagger specification is ready.');
  } catch (error) {
    console.log(`Definition file error':\n${error.message}`);
    process.exit();
  }
};

executeBinary();
