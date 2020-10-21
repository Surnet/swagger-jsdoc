/* istanbul ignore file */

const host = `http://${process.env.IP}:${process.env.PORT}`;

module.exports = {
  info: {},
  host, // Host (optional)
  basePath: '/', // Base path (optional)
};
