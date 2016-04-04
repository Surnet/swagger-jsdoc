'use strict';


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
  app.get('/hello', function(req, res) {
    res.send('Hello World (Version 2)!');
  });

  /**
   * @swagger
   * definition:
   *   Login2:
   *     required:
   *       - username
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       password:
   *         type: string
   */
};
