'use strict';

/**
 *	Sets up the routes.
 *	@param {object} app - Express app
 */
module.exports.setup = function (app) {

    /**
     *	@swagger
     *  /:
     *      get:
     *          responses:
     *              200:
     *                  description: hello world
     */
    app.get('/', rootHandler);

    /**
     *  @swagger
     *  /login:
     *      post:
     *          responses:
     *              200:
     *                  description: login
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