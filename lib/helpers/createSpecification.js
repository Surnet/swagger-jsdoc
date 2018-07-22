/**
 * Adds necessary properties for a given specification.
 * @see https://goo.gl/Eoagtl
 * @function
 * @param {object} definition - The `definition` or `swaggerDefinition` from options.
 * @returns {object} Object containing required properties of a given specification version.
 */
function createSpecification(definition) {
  // Properties corresponding to their specifications.
  var v2 = [
    "paths",
    "definitions",
    "responses",
    "parameters",
    "securityDefinitions"
  ];
  var v3 = [...v2, "components"];

  var standartizedSpec = {};

  if (definition.openapi) {
    standartizedSpec.openapi = definition.openapi;
    v3.forEach(property => {
      standartizedSpec[property] = standartizedSpec[property] || {};
    });
  } else if (definition.swagger) {
    standartizedSpec.swagger = definition.swagger;
    v2.forEach(property => {
      standartizedSpec[property] = standartizedSpec[property] || {};
    });
  } else {
    standartizedSpec.swagger = "2.0";
    v2.forEach(property => {
      standartizedSpec[property] = standartizedSpec[property] || {};
    });
  }

  standartizedSpec.tags = definition.tags || [];

  return Object.assign({}, standartizedSpec, definition);
}

module.exports = createSpecification;
