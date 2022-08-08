---
sidebar_position: 4
title: Project Goals
---

# Project Goals

**swagger-jsdoc** enables you to integrate [Swagger](http://swagger.io) using [`JSDoc`](https://jsdoc.app/) comments in your code. Just add `@swagger` (or `@openapi`) on top of an API-related annotation and and describe the given API part in YAML syntax. It's possible to pass YAML files directly outside the annotated source code.

`swagger-jsdoc` will parse the above-mentioned parts of your desired specification and will output a single file. You can use it to integrate any server and client technology as long as both sides comply with the specification.

Thus, the `swagger-jsdoc` library helps you document existing/living/working code in a way to "give life" to it, generating a specification which can then be fed into other Swagger tools, and not the vice-versa.

If you prefer to write the OpenAPI specification first and separately, you might check other projects facilitating this, such as

- [swagger-editor](http://swagger.io/swagger-editor/)
- [swagger-node](https://github.com/swagger-api/swagger-node)

## What swagger-jsdoc is NOT (doing)

The library does not add logic (implementation) to your specification. It is based on code annotations or static YAML files, but not the logic itself. If you use [Swagger UI](https://swagger.io/tools/swagger-ui/) or a similar tools to test your API and you receive errors, unexpected results and mystical data, it's not because of swagger-jsdoc library. It works only with what you put around your logic, not the contents of the logic.
