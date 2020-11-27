# swagger-jsdoc

This library reads your [JSDoc](https://jsdoc.app/)-annotated source code and generates an [OpenAPI (Swagger) specification](https://swagger.io/specification/).

[![npm Downloads](https://img.shields.io/npm/dm/swagger-jsdoc.svg)](https://www.npmjs.com/package/swagger-jsdoc)
![CI](https://github.com/Surnet/swagger-jsdoc/workflows/CI/badge.svg)

## Installation

```bash
npm install swagger-jsdoc --save
```

Or

```bash
yarn add swagger-jsdoc
```

## Supported specifications

- OpenAPI 3.x
- Swagger 2

## Documentation

It's available within [`/docs`](https://github.com/Surnet/swagger-jsdoc/tree/master/docs/README.md).

### Webpack integrations

- [swagger-jsdoc-webpack-plugin](https://github.com/patsimm/swagger-jsdoc-webpack-plugin) - Rebuild the swagger definition based on a predefined list of files on each webpack build.
- [swagger-jsdoc-sync-webpack-plugin](https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin) - Rebuild the swagger definition based on the files imported in your app on each webpack build.

## Reporting issues

Before starting a new issue, please [check whether there is an existing one](https://github.com/Surnet/swagger-jsdoc/issues). It is quite possible that the topic you would like to bring up has been discussed already in the past.

In case of an issue which hasn't been considered yet, please include as much information as possible. This will help maintainers and other users relate to your problem and possibly solve it.

Guidelines:

- Describe what you were doing when the issue appeared.
- Add a set of steps to reproduce your issue.
- Include screenshots.
- Give examples on expected vs actual behavior.
- Share your failed attempts: what you have tried and what you have considered.

## Contributing

The project exists thanks to the [many contributors](https://github.com/Surnet/swagger-jsdoc/graphs/contributors) who shared their use cases, questions, comments and suggestions for improvements.

Here's how to jump in and contribute yourself:

- Fork the project and clone it locally.
- Create a branch for each separate topic. [Semantic commit messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) will be highly appreciated.
- Comment your code as if you are going to maintain it in the future.
- Use the rich set of unit tests as an example and add more for the new use cases. This will not only enable you to programatically reproduce your fix faster than setting up an application, but it will also make you super cool! :)
- Push to your changes to the origin of your repository and create a new pull request towards the upstream master. (this repository)
