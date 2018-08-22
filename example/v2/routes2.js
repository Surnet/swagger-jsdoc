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

  /**
   * featureX
   * @swagger
   * /newFeatureX:
   *   get:
   *     description: Part of feature X
   *     responses:
   *       200:
   *         description: hello feature X
   */
  app.get('/newFeatureX', (req, res) => {
    res.send('This is a new feature X!');
  });

  /**
   * featureY
   * @swagger
   * /newFeatureY:
   *   get:
   *     description: Part of feature Y
   *     responses:
   *       200:
   *         description: hello feature Y
   */
  app.get('/newFeatureY', (req, res) => {
    res.send('This is another new feature Y!');
  });
};
