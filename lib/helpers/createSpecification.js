/* eslint no-self-assign: 0 */

/**
 * Adds necessary properties for a given specification.
 * @see https://goo.gl/Eoagtl
 * @function
 * @param {object} definition - The `definition` or `swaggerDefinition` from options.
 * @returns {object} Object containing required properties of a given specification version.
 */
function createSpecification(definition) {
  const specification = JSON.parse(JSON.stringify(definition));

  // Properties corresponding to their specifications.
  const v2 = [
    'paths',
    'definitions',
    'responses',
    'parameters',
    'securityDefinitions',
  ];
  const v3 = [...v2, 'components'];

  if (specification.openapi) {
    specification.openapi = specification.openapi;
    v3.forEach((property) => {
      specification[property] = specification[property] || {};
    });
  } else if (specification.swagger) {
    specification.swagger = specification.swagger;
    v2.forEach((property) => {
      specification[property] = specification[property] || {};
    });
  } else {
    specification.swagger = '2.0';
    v2.forEach((property) => {
      specification[property] = specification[property] || {};
    });
  }

  specification.tags = specification.tags || [];

  return specification;
}

module.exports = createSpecification;
