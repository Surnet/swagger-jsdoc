const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const sh = promisify(exec);
const bin = `${process.env.PWD}/bin/swagger-jsdoc.js`;

describe('command line interface', () => {
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
    const result = await sh(`${bin} -d test/fixtures/v2/empty_definition.js`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require title and version in the info object', async () => {
    const result = await sh(`${bin} -d test/fixtures/v2/wrong_definition.js`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require arguments with jsDoc data about an API', async () => {
    const result = await sh(`${bin} -d example/v2/swaggerDef.js`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should create swagger.json by default when the API input is good', async () => {
    const result = await sh(
      `${bin} -d example/v2/swaggerDef.js example/v2/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should create swagger.json by default when the API input is from definition file', async () => {
    const result = await sh(`${bin} -d test/fixtures/v2/api_definition.js`);
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should accept custom configuration for output specification', async () => {
    const result = await sh(
      `${bin} -d example/v2/swaggerDef.js -o customSpec.json example/v2/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('customSpec.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should create a YAML swagger spec when a custom output configuration with a .yaml extension is used', async () => {
    const result = await sh(
      `${bin} -d example/v2/swaggerDef.js -o customSpec.yaml example/v2/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('customSpec.yaml');
    expect(specification.nlink).not.toBe(0);
  });

  it('should allow a JavaScript definition file', async () => {
    const result = await sh(`${bin} -d test/fixtures/v2/api_definition.js`);
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should allow a JSON definition file', async () => {
    const result = await sh(`${bin} -d test/fixtures/api_definition.json`);
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should allow a YAML definition file', async () => {
    const result = await sh(`${bin} -d test/fixtures/api_definition.yaml`);
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should reject definition file with invalid YAML syntax', async () => {
    const result = await sh(`${bin} -d test/fixtures/wrong_syntax.yaml`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should reject definition file with non-JSON compatible YAML syntax', async () => {
    const result = await sh(`${bin} -d test/fixtures/non_json_compatible.yaml`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should reject definition file with invalid JSON syntax', async () => {
    const result = await sh(`${bin} -d test/fixtures/wrong_syntax.json`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should reject bad YAML identation with feedback: upper line', async () => {
    try {
      await sh(
        `${bin} -d example/v2/swaggerDef.js test/fixtures/wrong-yaml-identation1.js`
      );
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it('should reject bad YAML identation with feedback: same line', async () => {
    try {
      await sh(
        `${bin} -d example/v2/swaggerDef.js test/fixtures/wrong-yaml-identation2.js`
      );
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  afterAll(() => {
    fs.unlinkSync(`${process.env.PWD}/swagger.json`);
    fs.unlinkSync(`${process.env.PWD}/customSpec.json`);
    fs.unlinkSync(`${process.env.PWD}/customSpec.yaml`);
    fs.unlinkSync(`${process.env.PWD}/customSpec.yml`);
  });
});
