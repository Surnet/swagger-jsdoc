var glob = require("glob");

/**
 * Converts an array of globs to full paths
 * @function
 * @param {array} globs - Array of globs and/or normal paths
 * @return {array} Array of fully-qualified paths
 * @requires glob
 */
function convertGlobPaths(globs) {
  return globs.reduce(function(acc, globString) {
    var globFiles = glob.sync(globString);
    return acc.concat(globFiles);
  }, []);
}

module.exports = convertGlobPaths;
