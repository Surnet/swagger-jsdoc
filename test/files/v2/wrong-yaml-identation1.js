/* istanbul ignore file */

module.exports = (app) => {
  /**
   * @swagger
   *
   * /invalid_yaml:
   *        - foo
   *   bar
   */
  app.get('/invalid_yaml', (req, res) => {
    res.send('This should throw error with concrete line to fix in identation');
  });
};
