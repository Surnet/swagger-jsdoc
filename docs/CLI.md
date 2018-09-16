## Command line usage of `swagger-jsdoc`

If the module is installed globally, a command line helper `$ swagger-jsdoc` will be available.
Otherwise `./bin/swagger-jsdoc` has access to the same interface.

### Usage

The easiest way to get started is using the help menu.

```
$ swagger-jsdoc -h
```

#### Specify a definition file

Swagger-jsdoc will read the `apis` array in your definition file by default for file paths it should read.

```
$ swagger-jsdoc -d swaggerDef.js -o doc.json
```

This could be any .js, .json, .yml or .yaml file.

#### Specify input files (optional)

```
$ swagger-jsdoc route1.js route2.js
```

Free form input, can be before or after definition. [Glob patterns](https://github.com/isaacs/node-glob) are acceptable to match multiple files with same extension `*.js`, `*.php`, etc. or patterns selecting files in nested folders as `**/*.js`, `**/*.php`, etc.

#### Specify output file (optional)

```
$ swagger-jsdoc -o custom_specification.json
```

`swagger.json` by default. Output specification can accept also a `.yaml` or `.yml`. This generated OpenAPI specification can then be further tweaked with [`swagger-editor`](http://swagger.io/swagger-editor/) or similar.
