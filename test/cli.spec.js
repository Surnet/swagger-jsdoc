const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const sh = promisify(exec);
const dir = process.env.PWD || process.cwd();
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
    const result = await sh(`${bin} -d test/files/v2/empty_definition.cjs`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require title and version in the info object', async () => {
    const result = await sh(`${bin} -d test/files/v2/wrong_definition.cjs`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should require arguments with jsDoc data about an API', async () => {
    const result = await sh(`${bin} -d examples/app/swaggerDefinition.cjs`);
    expect(result.stdout).toMatchSnapshot();
  });

  it('should create swagger.json by default when the API input is good', async () => {
    const result = await sh(
      `${bin} -d examples/app/swaggerDefinition.cjs examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should create swagger.json by default when the API input is from definition file', async () => {
    const result = await sh(
      `${bin} -d test/files/v2/api_definition.cjs examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('swagger.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should accept custom configuration for output specification', async () => {
    const result = await sh(
      `${bin} -d examples/app/swaggerDefinition.cjs examples/app/routes.js -o customSpec.json`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('customSpec.json');
    expect(specification.nlink).not.toBe(0);
  });

  it('should create a YAML swagger spec when a custom output configuration with a .yaml extension is used', async () => {
    const result = await sh(
      `${bin} -d examples/app/swaggerDefinition.cjs -o customSpec.yaml examples/app/routes.js`
    );
    expect(result.stdout).toBe('Swagger specification is ready.\n');
    const specification = fs.statSync('customSpec.yaml');
    expect(specification.nlink).not.toBe(0);
  });

  it('should allow a JavaScript definition file', async () => {
    const result = await sh(
      `${bin} -d test/files/v2/api_definition.cjs examples/app/routes.js`
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
      `${bin} -d examples/app/swaggerDefinition.cjs test/files/v2/wrong-yaml-identation.js`
    );

    expect(result.stdout).toContain(
      'Not all input has been taken into account at your final specification.'
    );
    expect(result.stderr).toMatchSnapshot();
  });

  it('should generate json final file from separated files', async () => {
    const result = await sh(
      `${bin} -d examples/eventDriven/asyncApiConfig.js examples/eventDriven/src/modules/**/*.yml -o examples/eventDriven/src/customSpec.json`
    );

    expect(result.stdout).toMatchSnapshot();
  });

  it('should generate yml final file from separated files', async () => {
    const result = await sh(
      `${bin} -d examples/eventDriven/asyncApiConfig.js examples/eventDriven/src/modules/**/*.yml -o examples/eventDriven/src/customSpec.yml`
    );

    expect(result.stdout).toMatchSnapshot();
  });

  afterAll(() => {
    if (fs.existsSync(`${dir}/swagger.json`)) {
      fs.unlinkSync(`${dir}/swagger.json`);
    }
    if (fs.existsSync(`${dir}/customSpec.json`)) {
      fs.unlinkSync(`${dir}/customSpec.json`);
    }
    if (fs.existsSync(`${dir}/customSpec.yaml`)) {
      fs.unlinkSync(`${dir}/customSpec.yaml`);
    }
    if (fs.existsSync(`${dir}/customSpec.yml`)) {
      fs.unlinkSync(`${dir}/customSpec.yml`);
    }
  });
});
