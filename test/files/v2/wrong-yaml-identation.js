/* istanbul ignore file */

module.exports = (app) => {
  /**
   * @swagger
   *
   * /invalid_yaml:
   *        - foo
   *   bar
   */
  app.get('/invalid_yaml', () => {});
};
