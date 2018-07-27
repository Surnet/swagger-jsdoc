/* istanbul ignore next */
// This file is an example, it's not functionally used by the module.

module.exports.setup = function(app) {
  /**
   * @swagger
   * /hello:
   *   get:
   *     description: Returns the homepage
   *     responses:
   *       200:
   *         description: hello world
   */
  app.get('/hello', (req, res) => {
    res.send('Hello World (Version 2)!');
  });
};
