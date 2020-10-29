/* istanbul ignore file */

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

  /**
   * @swagger
   *  x-amazon-apigateway-integrations:
   *  default-integration: &default-integration
   *   type: object
   *   x-amazon-apigateway-integration:
   *     httpMethod: POST
   *     passthroughBehavior: when_no_match
   *     type: aws_proxy
   *     uri: 'arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789:function:helloworldlambda/invocations'
   *
   * '/aws':
   *   get:
   *     summary: sample aws-specific route
   *     description: contains a reference outside this file
   *     security: []
   *     responses:
   *       200:
   *         description: OK
   *     x-amazon-apigateway-integration: *default-integration
   */
  app.get('/aws', () => {});
};
