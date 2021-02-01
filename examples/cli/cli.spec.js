import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { exec } from 'child_process';

const sh = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const bin = `node ${__dirname}/cli.js`;

describe('Example command line application', () => {
  it('should require a definition file', async () => {
    const result = await sh(`${bin} wrongDefinition`);
    console.log('result', result);
  });

  it('should produce results matching reference specification', async () => {
    const result = await sh(
      `${bin} --definition examples/app/swaggerDefinition.js --apis examples/app/parameters.* examples/app/route*`
    );
    console.log('result', result);
  });

  afterAll(async () => {
    await Promise.all([fs.unlink(`${dir}/swagger.json`)]);
  });
});
