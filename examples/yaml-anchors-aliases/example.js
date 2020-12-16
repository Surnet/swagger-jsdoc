/* istanbul ignore file */

module.exports = (app) => {
  /**
   * @swagger
   * /aws:
   *   get:
   *     summary: sample aws-specific route
   *     description: contains a reference outside this file
   *     security: []
   *     responses:
   *       200:
   *         description: OK
   *     x-amazon-apigateway-integration: *default-integration
   */
  app.get('/aws', () => {});
};
