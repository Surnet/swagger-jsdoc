import { promises as fs } from 'fs';
import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { exec } from 'child_process';

const sh = promisify(exec);
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const bin = `node ${__dirname}/cli.js`;

describe('Example command line application', () => {
  it('should produce results matching reference specification', async () => {
    const result = await sh(
      `${bin} --definition test/fixtures/swaggerDefinition/example.js --apis examples/app/parameters.* examples/app/route*`
    );
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(
      'Specification has been created successfully!\n'
    );
    const refSpec = require('./reference-specification.json');
    const resSpec = require(`${process.cwd()}/swagger.json`);
    expect(resSpec).toEqual(refSpec);
  });

  afterAll(async () => {
    await fs.unlink(`${process.cwd()}/swagger.json`);
  });
});
