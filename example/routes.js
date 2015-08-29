'use strict';


// Sets up the routes.
module.exports.setup = function(app) {


  /**
   * @swagger
   * /:
   *   get:
   *     description: Returns the homepage
   *     responses:
   *       200:
   *         description: hello world
   */
  app.get('/', function(req, res) {
    res.send('Hello World!');
  });

  /**
   * @swagger
   * definition:
   *   Login:
   *     required:
   *       - username
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       password:
   *         type: string
   */

  /**
   * @swagger
   * /login:
   *   post:
   *     description: Login to the application
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: username
   *         description: Username to use for login.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: login
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Login'
   */
  app.post('/login', function(req, res) {
    res.json(req.body);
  });

  /**
   * @swagger
   * /users:
   *   get:
   *     description: Returns users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
  app.get('/users', function(req, res) {
    res.json({
      username: 'jsmith',
    });
  });

  /**
   * @swagger
   * /users:
   *   post:
   *     description: Returns users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: username
   *         description: username for user
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: users
   */
  app.post('/users', function(req, res) {
    res.json(req.body);
  });

};
