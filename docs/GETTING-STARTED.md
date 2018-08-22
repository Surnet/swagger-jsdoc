## Getting started

`swagger-jsdoc` returns the validated OpenAPI specification as JSON or YAML.

```javascript
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    info: {
      title: 'Hello World', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  apis: ['./routes.js'], // Path to the API docs
  jsDocFilter: (jsDocComment) => { // Optional filtering mechanism applied on each API doc
    return true;
  }
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
```

Notes:

- `options.definition` could be also `options.swaggerDefinition`
- paths given in `options.apis` are resolved with [node-glob](https://github.com/isaacs/node-glob) in the background. Try to limit your patterns smartly to speed up discovery of files.

At this time you can do with the `swaggerSpec` whatever you want.
The simplest way would be serving it straight to the outside world:

```javascript
app.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
```

- `options.jsDocFilter` is a function which accepts only one variable `jsDocComment`. This `jsDocComment` represents each route documentation being iterated upon.
  
  If you want to optionally perform filters on each route documentation, return boolean `true` or `false` accordingly on certain logical conditions. This is useful for conditionally displaying certain route documentation based on different server deployments.

You could also use a framework like [swagger-tools](https://www.npmjs.com/package/swagger-tools) to serve the spec and a `swagger-ui`.

### How to document the API

The API can be documented in JSDoc-style with swagger spec in YAML.

```javascript
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
app.post('/login', function(req, res) {
  res.json(req.body);
});
```

As said earlier, API documentation filters could be put in place before having such API rendered on the JSON file. A sample is shown in [app.js](../example/v2/app.js) where some form of filtering is done.
```javascript
function jsDocFilter(jsDocComment) {
    // Do filtering logic here in order to determine whether
    // the JSDoc under scrunity will be displayed or not.
    // This function must return boolean. `true` to display, `false` to hide.
    const docDescription = jsDocComment.description;

    const features = docDescription.indexOf('feature') > -1;
    const featureX = docDescription.indexOf('featureX') > -1; // featureX is the filter keyword
    const featureY = docDescription.indexOf('featureY') > -1; // featureY is also another filter keyword
    
    // `featureFilter` is some external environment variable
    const enabledX =
      featureX && envVars && envVars.featureFilter.indexOf('X') > -1;
    const enabledY =
      featureY && envVars && envVars.featureFilter.indexOf('Y') > -1;

    const featuresEnabled = enabledX || enabledY;

    const existingRoutes = [];

    function includeDocs() {
      const route =
        jsDocComment &&
        jsDocComment.tags &&
        jsDocComment.tags[0] &&
        jsDocComment.tags[0].description &&
        jsDocComment.tags[0].description.split(':')[0];

      if (existingRoutes.indexOf(route) === -1) {
        // need to perform check if the route doc was previously added
        return true;
      }

      return false;
    }

    // featured route documentation
    if (features) {
      if (featuresEnabled) {
        return includeDocs();
      }
    } else {
      // original routes included here
      return includeDocs();
    }

    return false;
  },
};
```

When a route filter needs to be applied, the filter keyword may be used. In the example below, the `featureX` (coded above `@swagger`) is a filter keyword for the route to be included in the rendering of the JSON.
Note that the filter only reads keywords above the `@swagger` identifier.
```javascript
/**
 * featureX
 * @swagger
 * /newFeatureX:
 *   get:
 *     description: Part of feature X
 *     responses:
 *       200:
 *         description: hello feature X
 */
```

### Re-using Model Definitions

A model may be the same for multiple endpoints (Ex. User POST,PUT responses).

In place of writing (or copy and pasting) the same code into multiple locations, which can be error prone when adding a new field to the schema. You can define a model and re-use it across multiple endpoints. You can also reference another
model and add fields.

```javascript
/**
 * @swagger
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

/**
   * @swagger
   * /users:
   *   get:
   *     description: Returns users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/User'
   */
  app.get('/users', function(req, res) {
    res.json([ {
      id: 1,
      username: 'jsmith',
    }, {1
      id: 2,
      username: 'jdoe',
    } ]);
  });

  /**
   * @swagger
   * /users:
   *   post:
   *     description: Creates a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user
   *         description: User object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           $ref: '#/definitions/User'
   */
  app.post('/users', function(req, res) {
    // Generate ID
    req.body.id = Math.floor(Math.random() * 100) * 1
    res.json(req.body);
  });
```

Keep in mind that since v3 of the specification, you can use [components](https://swagger.io/docs/specification/components/) in order to definite and reuse resources.

### Load external definitions

You can load external definitions or paths after `swaggerJSDoc()` function.

```javascript
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);
// load external schema json
swaggerSpec.definitions.in_login = require("config/schemajson/in.login.schema.json");
swaggerSpec.definitions.out_login = require("config/schemajson/out.login.schema.json");
// or set manual paths
swaggerSpec.paths["api/v1/cool"] = {"get" : { ... } }
```

If you need more examples, feel free to browse the repository and its tests and examples.
