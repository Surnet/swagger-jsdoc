# Command line interface

Available with the same name of the package when installed globally:

```bash
swagger-jsdoc
```

Or through the standard ways provided by your package manager:

```bash
yarn swagger-jsdoc
```

## Usage

Print the help menu:

```bash
swagger-jsdoc -h
```

### Definition file

By default, the library will read the `apis` array from your definition file:

```bash
swagger-jsdoc -d swaggerDefinition.js
```

This could be any `.js`, `.json`, `.yml` or `.yaml` extensions.

### Input files (optional)

When you don't want to or can't pass `apis` from the definition above, specify like following:

One by one:

```bash
swagger-jsdoc -d swaggerDefinition.js route1.js route2.js component1.yaml component2.yaml
```

Multiple with a pattern:

```bash
swagger-jsdoc -d swaggerDefinition.js route*.js component*.yaml
```

[Glob patterns](https://github.com/isaacs/node-glob) are acceptable to match multiple files with same extension `*.js`, `*.php`, etc. or patterns selecting files in nested folders as `**/*.js`, `**/*.php`, etc.

These paths are relative to current directory from where `swagger-jsdoc` is ran, not the application holding the APIs.

### Output file (optional)

The output is `swagger.json` by default, but can be changed:

```bash
swagger-jsdoc -d swaggerDefinition.js -o my_spec.json
```

When `.yaml` or `.yml` extension is used, the specification will be parsed and saved in YAML.
