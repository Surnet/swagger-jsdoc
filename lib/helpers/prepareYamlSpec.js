const endOfLine = require('os').EOL;

const filterJsDocComments = require('./filterJsDocComments');

const prepareYamlSpec = specParts => {
  if (specParts.length === 0) return [];

  const ymlAnchorRX = /(?:^|\s)(&[a-z0-9]\w*)/gi;
  const flatten = [];

  specParts.forEach(part => {
    if (part.jsdoc) {
      flatten.push(filterJsDocComments(part.jsdoc));
    }
    if (part.yaml) {
      flatten.push(part.yaml);
    }
  });

  // Remove empty items.
  const filtered = flatten.filter(a => a.length);

  // Put anchors in the beginning.
  filtered.sort(itemsArray => {
    const anchor = itemsArray.find(item => {
      const anchors = ymlAnchorRX.exec(item);
      if (anchors && anchors.length) {
        return true;
      }
    });

    if (anchor) return -1;

    return 1;
  });

  const joined = filtered.map(el => el.join(endOfLine));
  return joined.join(endOfLine);
};

module.exports = prepareYamlSpec;
