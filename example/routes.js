'use strict';

/**
 *	Sets up the routes.
 *	@param {object} app - Express app
 */
module.exports.setup = function (app) {

	/**
	 *	@swagger
	 */
	app.get('/', rootHandler);

	/**
	 *  @swagger
	 *  path: /login
	 *  operations:
	 *    - httpMethod: POST
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
	app.get('/login', loginHandler);
};

function rootHandler(req, res) {
    res.send('Hello World!');
}

function loginHandler(req, res) {
	var user = {};
	user.username = req.param('username');
	user.password = req.param('password');
	res.json(user);
}
