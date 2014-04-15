{swagger-express}
=========

[Swagger](https://developers.helloreverb.com/swagger/) is a specification and complete framework 
implementation for describing, producing, consuming, and visualizing RESTful web services.
View [demo](http://petstore.swagger.wordnik.com/).

__{swagger-express}__ is a simple and clean solution to integrate swagger with express.

## Installation

    $ npm install -g swagger-express

## Quick Start

Configure {swagger-express} as express middleware.


`apiVersion`      -> Your api version.

`swaggerVersion`  -> Swagger version.

`swaggerUI`       -> Where is your swagger-ui?

`swaggerURL`      -> Path to use for swagger ui web interface.

`swaggerJSON`     -> Path to use for swagger ui JSON.

`basePath`        -> The basePath for swagger.js

`apis`            -> Define your api array.

`middleware`      -> Function before response.

```
var swagger = require('swagger-express');

app.configure(function(){
  ...
  app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    basePath: 'http://localhost:3000',
    apis: ['./api.js', './api.yml'],
    middleware: function(req, res){}
  }));
  app.use(app.router);
  ...
});
``` 
## Read from jsdoc

Example 'api.js'

```js

/**
 * @swagger
 * resourcePath: /api
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
```

## Read from yaml file

Example 'api.yml'

```yml
resourcePath: /api
description: All about API
apis: 

- path: /login
  operations:

  - httpMethod: POST
    summary: Login with username and password
    notes: Returns a user based on username
    responseClass: User
    nickname: login
    consumes: 
      - text/html
    parameters:

    - name: username
      dataType: string
      paramType: query
      required: true
      description: Your username

    - name: password
      dataType: string
      paramType: query
      required: true
      description: Your password

models:
    User:
      id: User
      properties:
        username:
          type: String
        password:
          type: String    
```

## Read from jsdoc

Example 'api.coffee'

```coffee

###
 * @swagger
 * resourcePath: /api
 * description: All about API
###

###
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
###

###
 * @swagger
 * models:
 *   User:
 *     id: User
 *     properties:
 *       username:
 *         type: String
 *       password:
 *         type: String
###
```


## Examples

Clone the {swagger-express} repo, then install the dev dependencies:

    $ git clone git://github.com/fliptoo/swagger-express.git --depth 1
    $ cd swagger-express
    $ npm install

and run the example:

    $ cd example
    $ node app.js
    
# Credits

- [Express](https://github.com/visionmedia/express)
- [swagger-jack](https://github.com/feugy/swagger-jack)

## License

(The MIT License)

Copyright (c) 2013 Fliptoo &lt;fliptoo.studio@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
