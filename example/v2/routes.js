// Sets up the routes.
module.exports.setup = function (app) {
  /**
   * @swagger
   * /:
   *   get:
   *     description: Returns the homepage
   *     responses:
   *       200:
   *         description: hello world
   */
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  /**
   * @swagger
   * definitions:
   *   Login:
   *     required:
   *       - username
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       password:
   *         type: string
   *       path:
   *         type: string
   */

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management and login
   */

  /**
   * @swagger
   * tags:
   *   - name: Login
   *     description: Login
   *   - name: Accounts
   *     description: Accounts
   */

  /**
   * @swagger
   * /login:
   *   post:
   *     description: Login to the application
   *     tags: [Users, Login]
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
  app.post('/login', (req, res) => {
    res.json(req.body);
  });

  /**
   * @swagger
   * /users:
   *   get:
   *     description: Returns users
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
  app.get('/users', (req, res) => {
    res.json({
      username: 'jsmith',
    });
  });

  /**
   * @swagger
   * /users:
   *   post:
   *     description: Returns users
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/username'
   *     responses:
   *       200:
   *         description: users
   */
  app.post('/users', (req, res) => {
    res.json(req.body);
  });
};
