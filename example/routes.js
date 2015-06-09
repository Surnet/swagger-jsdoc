'use strict';


// Handler for the Homepage
function rootHandler(req, res) {
  res.send('Hello World!');
}


// Handler for Login
function loginHandler(req, res) {
  res.json(req.body);
}


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
  app.get('/', rootHandler);


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
   */
  app.post('/login', loginHandler);
};