###
* @swagger
* /login:
*   post:
*     description: Login to the application
*     produces:
*       - application/json
###
app.post '/login', (req, res) ->
  res.json req.body