/* eslint no-unused-expressions: 0 */
const specHelper = require('../lib/helpers/specification');
const hasEmptyProperty = require('../lib/helpers/hasEmptyProperty');
const parseApiFileContent = require('../lib/helpers/parseApiFileContent');

const swaggerObject = require('./files/v2/swaggerObject.json');
const testData = require('./files/v2/testData');

describe('Helpers', () => {
  describe('addDataToSwaggerObject', () => {
    it('should be a function', () => {
      expect(typeof specHelper.addDataToSwaggerObject).toBe('function');
    });

    it('should validate input', () => {
      expect(() => {
        specHelper.addDataToSwaggerObject();
      }).toThrow('swaggerObject and data are required!');
    });

    it('should handle "definition" and "definitions"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.definitions);
      expect(swaggerObject.definitions).toEqual({
        DefinitionSingular: {
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
        DefinitionPlural: {
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      });
    });

    it('should handle "parameter" and "parameters"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.parameters);
      expect(swaggerObject.parameters).toEqual({
        ParameterSingular: {
          name: 'username',
          description: 'Username to use for login.',
          in: 'formData',
          required: true,
          type: 'string',
        },
        ParameterPlural: {
          name: 'limit',
          in: 'query',
          description: 'max records to return',
          required: true,
          type: 'integer',
          format: 'int32',
        },
      });
    });

    it('should handle "securityDefinition" and "securityDefinitions"', () => {
      specHelper.addDataToSwaggerObject(
        swaggerObject,
        testData.securityDefinitions
      );
      expect(swaggerObject.securityDefinitions).toEqual({
        basicAuth: {
          type: 'basic',
          description:
            'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`',
        },
        api_key: { type: 'apiKey', name: 'api_key', in: 'header' },
        petstore_auth: {
          type: 'oauth2',
          authorizationUrl: 'http://swagger.io/api/oauth/dialog',
          flow: 'implicit',
          scopes: {
            'write:pets': 'modify pets in your account',
            'read:pets': 'read your pets',
          },
        },
      });
    });

    it('should handle "response" and "responses"', () => {
      specHelper.addDataToSwaggerObject(swaggerObject, testData.responses);
      expect(swaggerObject.responses).toEqual({
        NotFound: { description: 'Entity not found.' },
        IllegalInput: { description: 'Illegal input for operation.' },
      });
    });
  });

  describe('hasEmptyProperty', () => {
    it('identifies object with an empty object or array as property', () => {
      const invalidA = { foo: {} };
      const invalidB = { foo: [] };
      const validA = { foo: { bar: 'baz' } };
      const validB = { foo: ['¯_(ツ)_/¯'] };
      const validC = { foo: '¯_(ツ)_/¯' };

      expect(hasEmptyProperty(invalidA)).toBe(true);
      expect(hasEmptyProperty(invalidB)).toBe(true);
      expect(hasEmptyProperty(validA)).toBe(false);
      expect(hasEmptyProperty(validB)).toBe(false);
      expect(hasEmptyProperty(validC)).toBe(false);
    });
  });

  describe('parseApiFileContent', () => {
    it('should extract jsdoc comments inside .js files', () => {
      const fileContent = `
        // Sets up the routes.
        module.exports.setup = function (app) {
          /**
           * @swagger
           * tags:
           *   name: Users
           *   description: User management and login
           */

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
        };
      `;

      expect(parseApiFileContent(fileContent, '.js')).toEqual({
        yaml: [],
        jsdoc: [
          {
            description: '',
            tags: [
              {
                title: 'swagger',
                description:
                  'tags:\n  name: Users\n  description: User management and login',
              },
            ],
          },
          {
            description: '',
            tags: [
              {
                title: 'swagger',
                description:
                  "/users:\n  post:\n    description: Returns users\n    tags: [Users]\n    produces:\n      - application/json\n    parameters:\n      - $ref: '#/parameters/username'\n    responses:\n      200:\n        description: users",
              },
            ],
          },
        ],
      });
    });

    it('should extract coffeescript comments inside .coffee files', () => {
      const fileContent = `
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
    `;

      expect(parseApiFileContent(fileContent, '.coffee')).toEqual({
        yaml: [],
        jsdoc: [
          {
            description: '/',
            tags: [
              {
                title: 'swagger',
                description:
                  "/login:\n  post:\n    description: Login to the application\n    produces:\n      - application/json\n    parameters:\n      - name: username\n        description: Username to use for login.\n        in: formData\n        required: true\n        type: string\n      - name: password\n        description: User's password.\n        in: formData\n        required: true\n        type: string\n    responses:\n      200:\n        description: login",
              },
            ],
          },
        ],
      });
    });
  });
});
