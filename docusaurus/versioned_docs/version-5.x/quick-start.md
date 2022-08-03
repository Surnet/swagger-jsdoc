---
sidebar_position: 4
title: Quick Start
---

# Quick Start

Note that `swagger-jsdoc` uses [node glob](https://github.com/isaacs/node-glob) module in the background when taking your files. This means that you can use patterns such as `*.js` to select all javascript files or `**/*.js` to select all javascript files in sub-folders recursively.

Paths provided are relative to the current directory from which you execute the program.

### Examples

There are plenty of examples you can use to start off:

- `example`: contains an example app with version 2 of the specification. It will give you an idea how to annotate your comments in order to include them in the output specification.
- `test/cli`: CLI tests you can read to get ideas about the available functionalities of the CLI. (apart from the obvious help menu)
- `test/example`: various assets for tests you can also re-use for starting definitions, routes, etc.

### CLI

On top of the Node API, there is also a [command line interface](./cli).