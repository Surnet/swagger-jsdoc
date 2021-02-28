#!/usr/bin/env node
import { promises as fs } from 'fs';
import { pathToFileURL } from 'url';
import { loadDefinition } from './utils.js';

import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Handle CLI arguments in your preferred way.
 * @see https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */
const args = process.argv.slice(2);

/**
 * Extract definition
 * Pass an absolute specifier with file:/// to the loader.
 * The relative and bare specifiers would be based on assumptions which are not stable.
 * For example, if path from cli `examples/app/parameters.*` goes in, it will be assumed as bare, which is wrong.
 */
const definitionUrl = pathToFileURL(
  args.splice(
    args.findIndex((i) => i === '--definition'),
    2
  )[1] // Definition file is always only one.
);

// Because "Parsing error: Cannot use keyword 'await' outside an async function"
(async () => {
  /**
   * We're using an example module loader which you can swap with your own implemenentation.
   */
  const swaggerDefinition = await loadDefinition(definitionUrl.href);

  // Extract apis
  // remove --apis flag
  args.splice(0, 1);
  // the rest of this example can be treated as the contents of the --apis
  const apis = args;

  // Use the library
  const spec = await swaggerJsdoc({ swaggerDefinition, apis });

  // Save specification place and format
  await fs.writeFile('swagger.json', JSON.stringify(spec, null, 2));

  console.log('Specification has been created successfully!');
})();
