#!/usr/bin/env node
import { promises as fs } from 'fs';
import { pathToFileURL } from 'url';

import { loadDefinition } from '../../src/utils.js';
import swaggerJsdoc from '../../src/lib.js';

// Handle CLI arguments in your preferred way.
// @see https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
const args = process.argv.slice(2);

// Extract definition file.
// It's always only 1.
// The definition loader requires an absolute specifier with file:///
const definitionUrl = pathToFileURL(
  args.splice(
    args.findIndex((i) => i === '--definition'),
    2
  )[1]
);

// Because "Parsing error: Cannot use keyword 'await' outside an async function"
(async () => {
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
