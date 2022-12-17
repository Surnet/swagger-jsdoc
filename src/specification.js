const doctrine = require('doctrine');
const parser = require('swagger-parser');
const YAML = require('yaml');

const {
  hasEmptyProperty,
  convertGlobPaths,
  extractAnnotations,
  mergeDeep,
  extractYamlFromJsDoc,
  isTagPresentInTags,
} = require('./utils');

/**
 * Prepare the swagger/openapi specification object.
 * @see https://github.com/OAI/OpenAPI-Specification/tree/master/versions
 * @param {object} definition - The `definition` or `swaggerDefinition` from options.
 * @returns {object} swaggerObject
 */
function prepare(definition) {
  const swaggerObject = JSON.parse(JSON.stringify(definition));
  const specificationTemplate = {
    v2: [
      'paths',
      'definitions',
      'responses',
      'parameters',
      'securityDefinitions',
    ],
    v3: [
      'paths',
      'definitions',
      'responses',
      'parameters',
      'securityDefinitions',
      'components',
    ],
    v4: ['components', 'channels'],
  };

  const getVersion = () => {
    if (swaggerObject.asyncapi) {
      return 'v4';
    }

    if (swaggerObject.openapi) {
      return 'v3';
    }

    if (swaggerObject.swagger) {
      return 'v2';
    }

    swaggerObject.swagger = '2.0';
    return 'v2';
  };

  const version = getVersion();

  specificationTemplate[version].forEach((property) => {
    swaggerObject[property] = swaggerObject[property] || {};
  });

  swaggerObject.tags = swaggerObject.tags || [];

  return swaggerObject;
}

/**
 * @param {object} obj
 * @param {string} ext
 */
function format(swaggerObject, ext) {
  if (ext === '.yml' || ext === '.yaml') {
    return YAML.stringify(swaggerObject);
  }
  return swaggerObject;
}

/**
 * OpenAPI specification validator does not accept empty values for a few properties.
 * Solves validator error: "Schema error should NOT have additional properties"
 * @param {object} swaggerObject
 * @returns {object} swaggerObject
 */
function clean(swaggerObject) {
  for (const prop of [
    'definitions',
    'responses',
    'parameters',
    'securityDefinitions',
  ]) {
    if (hasEmptyProperty(swaggerObject[prop])) {
      delete swaggerObject[prop];
    }
  }

  return swaggerObject;
}

/**
 * Parse the swagger object and remove useless properties if necessary.
 *
 * @param {object} swaggerObject - Swagger object from parsing the api files.
 * @returns {object} The specification.
 */
function finalize(swaggerObject, options) {
  let specification = swaggerObject;
  parser.parse(swaggerObject, (err, api) => {
    if (!err) {
      specification = api;
    }
  });

  if (specification.openapi) {
    specification = clean(specification);
  }

  return format(specification, options.format);
}

/**
 * @param {object} swaggerObject
 * @param {object} annotation
 * @param {string} property
 */
function organize(swaggerObject, annotation, property) {
  // Root property on purpose.
  // @see https://github.com/OAI/OpenAPI-Specification/blob/master/proposals/002_Webhooks.md#proposed-solution
  if (property === 'x-webhooks') {
    swaggerObject[property] = mergeDeep(
      swaggerObject[property],
      annotation[property]
    );
  }

  // Other extensions can be in varying places depending on different vendors and opinions.
  // The following return makes it so that they are not put in `paths` in the last case.
  // New specific extensions will need to be handled on case-by-case if to be included in `paths`.
  if (property.startsWith('x-')) return;

  const commonProperties = [
    'components',
    'consumes',
    'produces',
    'paths',
    'schemas',
    'securityDefinitions',
    'responses',
    'parameters',
    'definitions',
    'channels',
  ];
  if (commonProperties.includes(property)) {
    for (const definition of Object.keys(annotation[property])) {
      swaggerObject[property][definition] = mergeDeep(
        swaggerObject[property][definition],
        annotation[property][definition]
      );
    }
  } else if (property === 'tags') {
    const { tags } = annotation;

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (!isTagPresentInTags(tag, swaggerObject.tags)) {
          swaggerObject.tags.push(tag);
        }
      }
    } else if (!isTagPresentInTags(tags, swaggerObject.tags)) {
      swaggerObject.tags.push(tags);
    }
  } else {
    // Paths which are not defined as "paths" property, starting with a slash "/"
    swaggerObject.paths[property] = mergeDeep(
      swaggerObject.paths[property],
      annotation[property]
    );
  }
}

/**
 * @param {object} options
 * @returns {object} swaggerObject
 */
function build(options) {
  YAML.defaultOptions.keepCstNodes = true;

  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  const specification = prepare(definition);
  const yamlDocsAnchors = new Map();
  const yamlDocsErrors = [];
  const yamlDocsReady = [];

  for (const filePath of convertGlobPaths(options.apis)) {
    const {
      yaml: yamlAnnotations,
      jsdoc: jsdocAnnotations,
    } = extractAnnotations(filePath, options.encoding);

    if (yamlAnnotations.length) {
      for (const annotation of yamlAnnotations) {
        const parsed = Object.assign(YAML.parseDocument(annotation), {
          filePath,
        });

        const anchors = parsed.anchors.getNames();
        if (anchors.length) {
          for (const anchor of anchors) {
            yamlDocsAnchors.set(anchor, parsed);
          }
        } else if (parsed.errors && parsed.errors.length) {
          // Attach the relevent yaml section to the error for verbose logging
          parsed.errors.forEach((err) => {
            err.annotation = annotation;
          });
          yamlDocsErrors.push(parsed);
        } else {
          yamlDocsReady.push(parsed);
        }
      }
    }

    if (jsdocAnnotations.length) {
      for (const annotation of jsdocAnnotations) {
        const jsDocComment = doctrine.parse(annotation, { unwrap: true });
        for (const doc of extractYamlFromJsDoc(jsDocComment)) {
          const parsed = Object.assign(YAML.parseDocument(doc), { filePath });

          const anchors = parsed.anchors.getNames();
          if (anchors.length) {
            for (const anchor of anchors) {
              yamlDocsAnchors.set(anchor, parsed);
            }
          } else if (parsed.errors && parsed.errors.length) {
            // Attach the relevent yaml section to the error for verbose logging
            parsed.errors.forEach((err) => {
              err.annotation = doc;
            });
            yamlDocsErrors.push(parsed);
          } else {
            yamlDocsReady.push(parsed);
          }
        }
      }
    }
  }

  if (yamlDocsErrors.length) {
    for (const docWithErr of yamlDocsErrors) {
      const errsToDelete = [];
      docWithErr.errors.forEach((error, index) => {
        if (error.name === 'YAMLReferenceError') {
          // This should either be a smart regex or ideally a YAML library method using the error.range.
          // The following works with both pretty and not pretty errors.
          const refErr = error.message
            .split('Aliased anchor not found: ')
            .filter((a) => a)
            .join('')
            .split(' at line')[0];
          const anchor = yamlDocsAnchors.get(refErr);
          const anchorString = anchor.cstNode.toString();
          const originalString = docWithErr.cstNode.toString();
          const readyDocument = YAML.parseDocument(
            `${anchorString}\n${originalString}`
          );

          yamlDocsReady.push(readyDocument);
          errsToDelete.push(index);
        }
      });
      // reverse sort the deletion array so we always delete from the end
      errsToDelete.sort((a, b) => b - a);

      // Cleanup solved errors in order to allow for parser to pass through.
      for (const errIndex of errsToDelete) {
        docWithErr.errors.splice(errIndex, 1);
      }
    }

    // Format errors into a printable/throwable string
    const errReport = yamlDocsErrors
      .map(({ errors, filePath }) => {
        let str = `Error in ${filePath} :\n`;
        if (options.verbose) {
          str += errors
            .map(
              (e) =>
                `${e.toString()}\nImbedded within:\n\`\`\`\n  ${e.annotation.replace(
                  /\n/g,
                  '\n  '
                )}\n\`\`\``
            )
            .join('\n');
        } else {
          str += errors.map((e) => e.toString()).join('\n');
        }
        return str;
      })
      .filter((error) => !!error);

    if (errReport.length) {
      if (options.failOnErrors) {
        throw new Error(errReport);
      }
      // Place to provide feedback for errors. Previously throwing, now reporting only.
      console.info(
        'Not all input has been taken into account at your final specification.'
      );

      console.error(`Here's the report: \n\n\n ${errReport}`);
    }
  }

  for (const document of yamlDocsReady) {
    const parsedDoc = document.toJSON();
    for (const property in parsedDoc) {
      organize(specification, parsedDoc, property);
    }
  }

  return finalize(specification, options);
}

module.exports = { prepare, build, organize, finalize, format };
