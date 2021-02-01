#!/usr/bin/env node
import { promises as fs } from 'fs';

import swaggerJsdoc from '../../src/lib.js';
import { loadDefinition } from '../../src/utils.js';

// @see https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
const args = process.argv.slice(2);

// extract definition file: it's always only 1
const definition = args.splice(
  args.findIndex((i) => i === '--definition'),
  2
)[1];
const swaggerDefinition = await loadDefinition(definition);

// remove --apis flag
args.splice(0, 1);

// the rest of this example can be treated as the contents of the --apis
const apis = args;

// call the node api
const spec = swaggerJsdoc({ swaggerDefinition, apis });

// and save the result to your preferred place and format
await fs.writeFile('swagger.json', JSON.stringify(spec, null, 2));
