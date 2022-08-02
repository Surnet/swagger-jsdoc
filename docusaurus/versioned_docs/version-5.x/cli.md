---
sidebar_position: 5
title: CLI
---

# Command line interface

The CLI is a thin wrapper around the library Node API. It's available with the same name of the package when installed globally:

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

Set with `--definition` (or `-d`) flag:

```bash
swagger-jsdoc -d swaggerDefinition.js
```

Acceptable file extensions: `.cjs`, `.json`, `.yml`, `.yaml`.

### Input files

Set through arguments.

One by one:

```bash
swagger-jsdoc -d swaggerDefinition.cjs route1.js route2.js component1.yaml component2.yaml
```

Multiple with a pattern:

```bash
swagger-jsdoc -d swaggerDefinition.cjs route*.js component*.yaml
```

[Glob patterns](https://github.com/isaacs/node-glob) are acceptable to match multiple files with same extension `*.js`, `*.php`, etc. or patterns selecting files in nested folders as `**/*.js`, `**/*.php`, etc.

Paths are relative to the current working directory.

### Output file (optional)

The output is `swagger.json` by default, but can be changed:

```bash
swagger-jsdoc -d swaggerDefinition.cjs route1.js -o my_spec.json
```

When output file extension is `.yaml` or `.yml`, the specification will be parsed and saved in YAML format.
