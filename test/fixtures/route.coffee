# Coffeescript Example

###
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
###
app.post '/login', (req, res) ->
  res.json req.body