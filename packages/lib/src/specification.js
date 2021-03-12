import doctrine from 'doctrine';
import parser from 'swagger-parser';
import YAML from 'yaml';
import fs from 'fs';

import {
  convertGlobPaths,
  extractAnnotations,
  extractYamlFromJsDoc,
  hasEmptyProperty,
  isTagPresentInTags,
  mergeDeep,
} from './utils.js';

/**
 * Prepare the swagger/openapi specification object.
 * @see https://github.com/OAI/OpenAPI-Specification/tree/master/versions
 * @param {object} options The library input options.
 * @returns {object} swaggerObject
 */
export function prepare(options) {
  let version;
  const swaggerObject = options.swaggerDefinition || options.definition;
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
 * @param {object} obj
 * @param {string} ext
 */
export function format(swaggerObject, ext) {
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
export function clean(swaggerObject) {
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
export function finalize(swaggerObject, options) {
  let specification = swaggerObject;

  parser.parse(swaggerObject, (err, api) => {
    if (!err) {
      specification = api;
    }
  });

  if (specification.openapi) {
    specification = clean(specification);
  }

  if (options && options.format) {
    specification = format(specification, options.format);
  }

  return specification;
}

/**
 * @param {object} swaggerObject
 * @param {Array<object>} annotations
 * @returns {object} swaggerObject
 */
export function organize(swaggerObject, annotations) {
  for (const annotation of annotations) {
    for (const property in annotation) {
      // Root property on purpose.
      // @see https://github.com/OAI/OpenAPI-Specification/blob/master/proposals/002_Webhooks.md#proposed-solution
      if (property === 'x-webhooks') {
        swaggerObject[property] = annotation[property];
      }

      // Other extensions can be in varying places depending on different vendors and opinions.
      // The following return makes it so that they are not put in `paths` in the last case.
      // New specific extensions will need to be handled on case-by-case if to be included in `paths`.
      if (property.startsWith('x-')) continue;

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
          swaggerObject[property][definition] = mergeDeep(
            swaggerObject[property][definition],
            annotation[property][definition]
          );
        }
      } else if (property === 'tags') {
        if (swaggerObject.tags === undefined) {
          swaggerObject.tags = [];
        }
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
  }

  return swaggerObject;
}

/**
 * @param {object} options
 * @returns {object} swaggerObject
 */
export async function extract(options) {
  if (
    !options ||
    !options.apis ||
    options.apis.length === 0 ||
    Array.isArray(options.apis) === false
  ) {
    throw new Error(
      'Bad input parameter: options is required, as well as options.apis[]'
    );
  }

  YAML.defaultOptions.keepCstNodes = true;

  const yamlDocsAnchors = new Map();
  const yamlDocsErrors = [];
  const yamlDocsReady = [];

  for (const filePath of convertGlobPaths(options.apis)) {
    const {
      yaml: yamlAnnotations,
      jsdoc: jsdocAnnotations,
    } = await extractAnnotations(filePath, options.encoding);

    if (yamlAnnotations.length) {
      for (const annotation of yamlAnnotations) {
        const parsed = YAML.parseDocument(annotation);

        const anchors = parsed.anchors.getNames();
        if (anchors.length) {
          for (const anchor of anchors) {
            yamlDocsAnchors.set(anchor, parsed);
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
              yamlDocsAnchors.set(anchor, parsed);
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

    const errReport = yamlDocsErrors
      .map(({ errors }) => errors.join('\n'))
      .filter((error) => !!error);

    if (errReport.length) {
      if (options.failOnErrors) {
        fs.writeFileSync('bump.txt', errReport);
        throw new Error(errReport);
      }
      console.info(
        'Not all input has been taken into account at your final specification.'
      );

      console.error(`Here's the report: \n\n\n ${errReport}`);
    }
  }

  return yamlDocsReady.map((doc) => doc.toJSON());
}
