module.exports.setup = function (app) {
  /**
   * @swagger
   * /deprecated:
   *   get:
   *     description: Returns a string
   *     path: '/deprecated'
   *     responses:
   *       200:
   *         description: deprecated path
   */
  app.get('/deprecated', (req, res) => {
    res.send('Deprecated "path" property!');
  });
};
