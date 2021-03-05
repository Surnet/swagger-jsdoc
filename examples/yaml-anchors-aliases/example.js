/* istanbul ignore file */

module.exports = (app) => {
  /**
   * @swagger
   * /aws:
   *   get:
   *     summary: sample aws-specific route
   *     description: contains a reference outside this file, and pulls response params from multiple files.
   *     security: []
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: object
   *           properties:
   *             id: *id
   *             username: *username
   *
   *     x-amazon-apigateway-integration: *default-integration
   *     x-second-integration: *second-integration
   */
  app.get('/aws', () => {});

  /**
   * @swagger
   * /aws:
   *   post:
   *     summary: sample aws-specific route
   *     description: contains a reference outside this file, and pulls response params from multiple files.
   *     security: []
   *     parameters:
   *      - in : body
   *        name: user
   *        description: the request body for a fictional request that re-uses anchors referenced else where
   *        schema:
   *          type: object
   *          required:
   *            - username
   *            - id
   *          properties:
   *            username: *username
   *            id: *id
   *     responses:
   *       200:
   *         description: OK
   *     x-amazon-apigateway-integration: *default-integration
   *     x-second-integration: *second-integration
   */
  app.post('/aws', () => {});
};
