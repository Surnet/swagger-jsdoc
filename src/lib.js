import { prepare, extract, organize, finalize } from './specification.js';
import { validateOptions } from './utils.js';

/**
 * Generates the specification.
 * @param {object} options - Configuration options
 * @param {string} options.encoding Optional, passed to readFileSync options. Defaults to 'utf8'.
 * @param {string} options.format Optional, defaults to '.json' - target file format '.yml' or '.yaml'.
 * @param {object} options.swaggerDefinition
 * @param {object} options.definition
 * @param {array} options.apis
 * @returns {object|string} Output specification as json or yaml
 */
const lib = (options) => {
  validateOptions(options);

  const spec = prepare(options);
  const parts = extract(options);

  organize(spec, parts);

  return finalize(spec, options);
};

export default lib;
