import { prepare, extract, organize, finalize } from './src/specification.js';
import { validateOptions } from './src/utils.js';

/**
 * Main function
 * @param {object} options - Configuration options
 * @param {string} options.encoding Optional, passed to read file function options. Defaults to 'utf8'.
 * @param {boolean} options.failOnErrors Whether or not to throw when parsing errors. Defaults to false.
 * @param {string} options.format Optional, defaults to '.json' - target file format '.yml' or '.yaml'.
 * @param {object} options.swaggerDefinition
 * @param {object} options.definition
 * @param {array} options.apis
 * @returns {object|string} Output specification as json or yaml
 */
const lib = async (options) => {
  validateOptions(options);

  const spec = prepare(options);
  const parts = await extract(options);

  organize(spec, parts);

  return finalize(spec, options);
};

export default lib;
