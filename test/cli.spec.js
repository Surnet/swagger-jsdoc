import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const sh = promisify(exec);
const dir = process.env.PWD;
const bin = `${dir}/bin/swagger-jsdoc.js`;

describe('CLI module', () => {
  it('help menu is default fallback when no arguments', async () => {
    const result = await sh(`${bin}`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('help menu works', async () => {
    const result = await sh(`${bin} -h`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require a definition file', async () => {
    const result = await sh(`${bin} wrongDefinition`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require an info object in the definition', async () => {
    const result = await sh(`${bin} -d test/files/v2/empty_definition.js`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require title and version in the info object', async () => {
    const result = await sh(`${bin} -d test/files/v2/wrong_definition.js`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require arguments with jsDoc data about an API', async () => {
    const result = await sh(`${bin} -d examples/app/swaggerDefinition.js`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should create swagger.json by default when the API input is good', async () => {
    const result = await sh(
      `${bin} -d examples/app/swaggerDefinition.js examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should create swagger.json by default when the API input is from definition file', async () => {
    const result = await sh(
      `${bin} -d test/files/v2/api_definition.js examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should accept custom configuration for output specification', async () => {
    const result = await sh(
      `${bin} -d examples/app/swaggerDefinition.js -o customSpec.json examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('customSpec.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should create a YAML swagger spec when a custom output configuration with a .yaml extension is used', async () => {
    const result = await sh(
      `${bin} -d examples/app/swaggerDefinition.js -o customSpec.yaml examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('customSpec.yaml');
    expect(specification.nlink).not.toBe(0);
  });

  it('should allow a JavaScript definition file', async () => {
    const result = await sh(
      `${bin} -d test/files/v2/api_definition.js examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should allow a JSON definition file', async () => {
    const result = await sh(
      `${bin} -d test/files/v2/api_definition.json examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should allow a YAML definition file', async () => {
    const result = await sh(
      `${bin} -d test/files/v2/api_definition.yaml examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should reject definition file with invalid YAML syntax', async () => {
    const result = await sh(`${bin} -d test/files/v2/wrong_syntax.yaml`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should reject definition file with invalid JSON syntax', async () => {
    const result = await sh(`${bin} -d test/files/v2/wrong_syntax.json`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should report YAML documents with errors', async () => {
    const result = await sh(
      `${bin} -d examples/app/swaggerDefinition.js test/files/v2/wrong-yaml-identation.js`
    );

    expect(result.stdout).toContain(
      'Not all input has been taken into account at your final specification.'
    );
    expect(result.stderr).toMatchSnapshot();
  });

  afterAll(() => {
    fs.unlinkSync(`${dir}/swagger.json`);
    fs.unlinkSync(`${dir}/customSpec.json`);
    fs.unlinkSync(`${dir}/customSpec.yaml`);
    fs.unlinkSync(`${dir}/customSpec.yml`);
  });
});
