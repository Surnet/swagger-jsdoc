/* eslint no-unused-expressions: 0 */

const utils = require('../src/utils');

describe('Utilities module', () => {
  describe('hasEmptyProperty', () => {
    it('identifies object with an empty object or array as property', () => {
      const invalidA = { foo: {} };
      const invalidB = { foo: [] };
      const validA = { foo: { bar: 'baz' } };
      const validB = { foo: ['¯_(ツ)_/¯'] };
      const validC = { foo: '¯_(ツ)_/¯' };

      expect(utils.hasEmptyProperty(invalidA)).toBe(true);
      expect(utils.hasEmptyProperty(invalidB)).toBe(true);
      expect(utils.hasEmptyProperty(validA)).toBe(false);
      expect(utils.hasEmptyProperty(validB)).toBe(false);
      expect(utils.hasEmptyProperty(validC)).toBe(false);
    });
  });

  describe('getApiFileContent', () => {
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

      expect(utils.getApiFileContent(fileContent, '.js')).toEqual({
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

      expect(utils.getApiFileContent(fileContent, '.coffee')).toEqual({
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
