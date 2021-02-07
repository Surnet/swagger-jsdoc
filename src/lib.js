import { build } from './specification.js';
import { validateOptions } from './utils.js';

/**
 * Generates the specification.
 * @param {object} options - Configuration options
 * @param {string} options.encoding Optional, passed to readFileSync options. Defaults to 'utf8'.
 * @param {string} options.format Optional, defaults to '.json' - target file format '.yml' or '.yaml'.
 * @param {object} options.swaggerDefinition
 * @param {object} options.definition
 * @param {array} options.apis
 * @returns {object} Output specification
 */
const lib = (options) => {
  validateOptions(options);
  return build(options);
};

export default lib;
