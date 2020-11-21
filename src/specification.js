const parser = require('swagger-parser');
const YAML = require('yaml');
const doctrine = require('doctrine');

const {
  hasEmptyProperty,
  convertGlobPaths,
  extractAnnotations,
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
  let version;
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
  };

  if (swaggerObject.openapi) {
    version = 'v3';
  } else if (swaggerObject.swagger) {
    version = 'v2';
  } else {
    version = 'v2';
    swaggerObject.swagger = '2.0';
  }

  specificationTemplate[version].forEach((property) => {
    swaggerObject[property] = swaggerObject[property] || {};
  });

  swaggerObject.tags = swaggerObject.tags || [];

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
function finalize(swaggerObject) {
  let specification = swaggerObject;

  parser.parse(swaggerObject, (err, api) => {
    if (!err) {
      specification = api;
    }
  });

  if (specification.openapi) {
    specification = clean(specification);
  }

  return specification;
}

/**
 * @param {object} swaggerObject
 * @param {object} annotation
 * @param {string} property
 */
function organize(swaggerObject, annotation, property) {
  if (property.startsWith('x-')) return; // extensions defined "inline" in annotations are not useful for the end specification

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
  ];

  if (commonProperties.includes(property)) {
    for (const definition of Object.keys(annotation[property])) {
      swaggerObject[property][definition] = {
        ...swaggerObject[property][definition],
        ...annotation[property][definition],
      };
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
    swaggerObject.paths[property] = {
      ...swaggerObject.paths[property],
      ...annotation[property],
    };
  }
}

/**
 * @param {object} options
 * @returns {object} swaggerObject
 */
function build(options) {
  // YAML.defaultOptions.keepCstNodes = true;
  // YAML.defaultOptions.keepUndefined = true;
  // YAML.defaultOptions.prettyErrors = false;

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
    } = extractAnnotations(filePath);

    if (yamlAnnotations.length) {
      for (const annotation of yamlAnnotations) {
        const parsed = YAML.parseDocument(annotation);

        const anchors = parsed.anchors.getNames();
        if (anchors.length) {
          for (const anchor of anchors) {
            const node = parsed.anchors.getNode(anchor);
            yamlDocsAnchors.set(anchor, node);
          }
        } else if (parsed.errors && parsed.errors.length) {
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
          const parsed = YAML.parseDocument(doc);

          const anchors = parsed.anchors.getNames();
          if (anchors.length) {
            for (const anchor of anchors) {
              const node = parsed.anchors.getNode(anchor);
              yamlDocsAnchors.set(anchor, node);
            }
          } else if (parsed.errors && parsed.errors.length) {
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
      docWithErr.errors
        .filter((error) => error.name === 'YAMLReferenceError')
        // This should either be a smart regex or ideally a YAML library method using the error.range.
        .map(
          (error) =>
            error.message
              .split('Aliased anchor not found: ')
              .filter((a) => a)
              .join('')
              .split(' at line')[0]
        )
        .map((refErr) => {
          const node = yamlDocsAnchors.get(refErr);
          const alias = docWithErr.anchors.createAlias(node, refErr);
          docWithErr.contents.items.unshift(alias);
          const errorSolvedIndex = docWithErr.errors.findIndex((error) =>
            error.message.includes(refErr)
          );
          docWithErr.errors.splice(errorSolvedIndex, 1);
          return yamlDocsReady.push(docWithErr);
        });
    }
  }

  for (const document of yamlDocsReady) {
    const parsedDoc = document.toJSON();
    for (const property in parsedDoc) {
      organize(specification, parsedDoc, property);
    }
  }

  return finalize(specification);
}

module.exports = { prepare, build, organize, finalize };
