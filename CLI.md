## Command line usage of `swagger-jsdoc`

If the module is installed globally, a command line helper `$ swagger-jsdoc` will be available.
Otherwise `./bin/swagger-jsdoc` accesses to the same interface.

Common usage:

- Help menu: `./bin/swagger-jsdoc -h`
- Specify a swagger definition file: `./bin/swagger-jsdoc -d example/swaggerDef.js` - could be any .js or .json file which will be `require()`-ed and parsed/validated as JSON.
- Specify files with documentation: `./bin/swagger-jsdoc example/routes.js example/routes2.js` - free form input, can be before or after definition
- Specify output file (optional): `./bin/swagger-jsdoc -o output.json` - swagger.json will be created if this is not set.
If specifying an output file with a `.yaml` or `.yml` extension, the swagger spec will automatically be saved in YAML format instead of JSON.
- Watch for changes: `./bin/swagger-jsdoc -d example/swaggerDef.js example/routes.js example/routes2.js -w` - start a watch task for input files with API documentation.
This may be particularly useful when the output specification file is integrated with [Browsersync](https://browsersync.io/)
and [Swagger UI](http://swagger.io/swagger-ui/). Thus, the developer updates documentation in code with fast feedback in an
interface showing an example of live documentation based on the swagger specification.
