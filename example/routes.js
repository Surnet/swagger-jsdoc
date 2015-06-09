'use strict';

/**
 *	Handler for the Homepage
 *	@param {object} req - Express request
 *  @param {object} res - Express response
 */
function rootHandler(req, res) {
  res.send('Hello World!');
}

/**
 *	Handler for the Login
 *	@param {object} req - Express request
 *  @param {object} res - Express response
 */
function loginHandler(req, res) {
  res.json(req.body);
}

/**
 *	Sets up the routes.
 *	@param {object} app - Express app
 */
module.exports.setup = function(app) {

  /**
   *	@swagger
   *  /:
   *    get:
   *      description: Returns Hello World!
   *      responses:
   *        200:
   *          description: hello world
   */
  app.get('/', rootHandler);

  /**
   *  @swagger
   *  /login:
   *    post:
   *      description: Login to the application
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: username
   *          description: Username to use for login.
   *          in: formData
   *          required: true
   *          type: string
   *        - name: password
   *          description: User's password.
   *          in: formData
   *          required: true
   *          type: string
   *      responses:
   *        200:
   *          description: login
   */
  app.post('/login', loginHandler);
};