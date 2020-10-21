/* istanbul ignore file */

module.exports.setup = function (app) {
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
