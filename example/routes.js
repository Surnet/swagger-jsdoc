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
   * tag:
   *   name: Users
   *   description: User management and login
   */

  /**
   * @swagger
   * /login:
   *   post:
   *     description: Login to the application
   *     tag: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/username'
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
   *     tag: [Users]
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
   *     tag: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/username'
   *     responses:
   *       200:
   *         description: users
   */
  app.post('/users', function(req, res) {
    res.json(req.body);
  });

};
