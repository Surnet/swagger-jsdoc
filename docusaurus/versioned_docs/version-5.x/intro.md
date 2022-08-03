---
sidebar_position: 1
title: Overview
---

# swagger-jsdoc

Document your code and keep a live and reusable OpenAPI (Swagger) specification. This specification can be the core of your API-driven project: generate
documentation, servers, clients, tests and much more based on the rich [OpenAPI ecosystem of tools](http://swagger.io/).

[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
![CI](https://github.com/Surnet/swagger-jsdoc/workflows/CI/badge.svg)

## Goals

**swagger-jsdoc** enables you to integrate [Swagger](http://swagger.io)
using [`JSDoc`](https://jsdoc.app/) comments in your code. Just add `@swagger` (or `@openapi`) on top of your DocBlock and declare the meaning of your code in YAML complying to the OpenAPI specification. If you prefer to keep some parts of your specification aside your code in order to keep it lighter/cleaner, you can also pass these parts as separate input YAML files.

`swagger-jsdoc` will parse the above-mentioned and output an OpenAPI specification. You can use it to integrate any server and client technology as long as both sides comply with the specification.

Thus, the `swagger-jsdoc` project assumes that you want document your existing/living/working code in a way to "give life" to it, generating a specification which can then be fed into other Swagger tools, and not the vice-versa.

If you prefer to write the OpenAPI specification first and separately, you might check other projects facilitating this, such as

- [swagger-editor](http://swagger.io/swagger-editor/)
- [swagger-node](https://github.com/swagger-api/swagger-node)

### Webpack integration

You can use this package with a webpack plugin to keep your swagger documentation up-to-date when building your app:

- [swagger-jsdoc-webpack-plugin](https://github.com/patsimm/swagger-jsdoc-webpack-plugin) - Rebuild the swagger definition based on a predefined list of files on each webpack build.
- [swagger-jsdoc-sync-webpack-plugin](https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin) - Rebuild the swagger definition based on the files imported in your app on each webpack build.

## Supported versions

- OpenAPI 3.x
- Swagger 2.0

To make sure your end specification is valid, do read the most up-to date official [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification).
