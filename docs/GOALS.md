# Project Goals

**swagger-jsdoc** enables you to integrate [Swagger](http://swagger.io) using [`JSDoc`](https://jsdoc.app/) comments in your code. Just add `@swagger` (or `@openapi`) on top of an API-related annotation and and describe the given API part in YAML syntax. It's possible to pass YAML files directly outside the annotated source code. These specification parts from comments and input files will be combined and parsed as the result output swagger/openapi specification.

`swagger-jsdoc` will parse the above-mentioned parts of your desired specification and will output a single file with the end OpenAPI specification. You can use it to integrate any server and client technology as long as both sides comply with the specification.

Thus, the `swagger-jsdoc` project assumes that you want document your existing/living/working code in a way to "give life" to it, generating a specification which can then be fed into other Swagger tools, and not the vice-versa.

If you prefer to write the OpenAPI specification first and separately, you might check other projects facilitating this, such as

- [swagger-editor](http://swagger.io/swagger-editor/)
- [swagger-node](https://github.com/swagger-api/swagger-node)
