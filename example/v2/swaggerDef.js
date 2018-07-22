/* istanbul ignore next */
// This file is an example, it's not functionally used by the module.This

var host = 'http://' + process.env.IP + ':' + process.env.PORT;

module.exports = {
  info: { // API informations (required)
    title: 'Hello World', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'A sample API', // Description (optional)
  },
  host: host, // Host (optional)
  basePath: '/', // Base path (optional)
};
