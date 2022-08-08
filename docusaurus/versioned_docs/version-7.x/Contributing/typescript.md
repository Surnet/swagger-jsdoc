---
sidebar_position: 6
---

# Typescript

## Types

Please see [`@types/swagger-jsdoc`](https://www.npmjs.com/package/@types/swagger-jsdoc). The package has been created and maintained by one of the original creators of `swagger-jsdoc` [drGrove](https://github.com/drGrove).

## The library

It's currently written in Vanilla JavaScript compatible with Node.js 12 or higher. There are no compilation, transpilation or bundling steps. JSDoc comments and annotations have been maintained and published for intelligent editors.

No types definitions are managed or published from this repository.

## Re-using interfaces from source code

`swagger-jsdoc` is only taking into account JSDoc comments and pure YAML files. The library does not work with source code at all: no reading, no parsing, no modifications.

For scenarios in which you want the source code to be taken into account in your specification, use an alternative such as [`tsoa`](https://github.com/lukeautry/tsoa).
