
/**
 * @swagger
 * resourcePath: /apiJs
 * description: All about API
 */

/**
 * @swagger
 * path: /login
 * operations:
 *   -  httpMethod: POST
 *      summary: Login with username and password
 *      notes: Returns a user based on username
 *      responseClass: User
 *      nickname: login
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: username
 *          description: Your username
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: password
 *          description: Your password
 *          paramType: query
 *          required: true
 *          dataType: string
 */
exports.login = function (req, res) {
  var user = {};
  user.username = req.param('username');
  user.password = req.param('password');
  res.json(user);
}

/**
 * @swagger
 * models:
 *   User:
 *     id: User
 *     properties:
 *       username:
 *         type: String
 *       password:
 *         type: String
 */

// ---------------------------------------------------------------------------------------------------------------------

'use strict';

/**
 *	Sets up the routes.
 *	@param {object} app - Express app
 */
module.exports.setup = function (app) {
	app.get('/', rootHandler)
	app.get('/login', loginHandler);
}

/**
 *	@swagger
 *
 */
function rootHandler(req, res) {
    res.send('Hello World!');
});

/**
 *	@swagger
 *
 */
function loginHandler(req, res) {
	res.send('login');
}
