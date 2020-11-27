# Typescript

## The library

It's currently written in Vanilla JavaScript compatible with Node.js 12 or higher. There are no compilation, transpilation or bundling steps. JSDoc comments and annotations have been maintained and published for intelligent editors. However, no types are managed or published.

With time, it's possible that the library transitions into this direction, however first step would be to [reuse existing annotations and generate declarations](https://humanwhocodes.com/snippets/2020/10/create-typescript-declarations-from-javascript-jsdoc/), and publishing them. It's worth trying a similar approach to our [peer project yaml](https://github.com/eemeli/yaml) and its types management before going directly to full rewrite and compilation.

## Re-using interfaces

`swagger-jsdoc` is only taking into account JSDoc comments and pure YAML files. The library does not work with source code at all: no reading, no parsing, no modifications.

For scenarios in which you want the source code to be taken into account in your specification, use an alternative such as [`tsoa`](https://github.com/lukeautry/tsoa).
