module.exports = app => {
  /**
   * @swagger
   *
   * /invalid_yaml:
   * hey hey there
   *   im just some
   *     invalid yaml
   */
  app.get('/invalid_yaml', (req, res) => {
    res.send('This should throw error with concrete line to fix in identation');
  });
};
