import { promises as fs } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { loadDefinition } from './utils.js';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const cli = `${__dirname}/cli.js`;

describe('Example command line application', () => {
  it('should produce results matching reference specification', () => {
    const { stderr, stdout } = spawnSync(cli, [
      '--definition',
      resolve(__dirname, '../swaggerDefinition/example.js'),
      '--apis',
      resolve(__dirname, '../app/parameters.*'),
      resolve(__dirname, '../app/route*'),
    ]);
    expect(stderr.toString()).toBe('');
    expect(stdout.toString()).toBe(
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

describe('loadDefinition', () => {
  const example = '../swaggerDefinition/example';

  it('should throw on bad input', async () => {
    await expect(loadDefinition('bad/path/to/nowhere')).rejects.toThrow(
      'Definition file should be any of the following: .js, .mjs, .cjs, .json, .yml, .yaml'
    );
  });

  it('should support .json', async () => {
    const def = resolve(__dirname, `${example}.json`);
    const result = await loadDefinition(def);
    expect(result).toEqual({
      info: {
        title: 'Hello World',
        version: '1.0.0',
        description: 'A sample API',
      },
    });
  });

  it('should support .yaml', async () => {
    const def = resolve(__dirname, `${example}.yaml`);
    const result = await loadDefinition(def);
    expect(result).toEqual({
      info: {
        title: 'Hello World',
        version: '1.0.0',
        description: 'A sample API',
      },
    });
  });

  it('should support .js', async () => {
    const def = resolve(__dirname, `${example}.js`);
    const result = await loadDefinition(def);
    expect(result).toEqual({
      info: {
        title: 'Hello World',
        version: '1.0.0',
        description: 'A sample API',
      },
    });
  });

  it('should support .cjs', async () => {
    const def = resolve(__dirname, `${example}.cjs`);
    const result = await loadDefinition(def);
    expect(result).toEqual({
      info: {
        title: 'Hello World',
        version: '1.0.0',
        description: 'A sample API',
      },
    });
  });

  it('should support .mjs', async () => {
    const def = resolve(__dirname, `${example}.mjs`);
    const result = await loadDefinition(def);
    expect(result).toEqual({
      info: {
        title: 'Hello World',
        version: '1.0.0',
        description: 'A sample API',
      },
    });
  });
});
