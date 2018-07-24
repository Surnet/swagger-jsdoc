"use strict";

// Imaginary API helper

/**
 * @swagger
 *
 * components:
 *   links:
 *     UserRepositories:
 *       operationId: getRepositoriesByOwner
 *       parameters:
 *         username: '$response.body#/username'
 *   schemas:
 *     user:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         uuid:
 *           type: string
 */

/**
 * @swagger
 *
 * /users/{username}:
 *   get:
 *     operationId: getUserByName
 *     parameters:
 *     - name: username
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: The User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *         links:
 *           userRepositories:
 *             $ref: '#/components/links/UserRepositories'
 */
module.exports = function(app) {
  app.get("/users/:username", function() {});
};
