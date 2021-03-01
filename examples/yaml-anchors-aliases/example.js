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
   *     x-second-integration: *second-integration
   */
  app.get('/aws', () => {});

  /**
   * @swagger
   * /richie-rich:
   *   get:
   *     summary: another route
   *     description: contains a reference in the same file
   *     security: []
   *     responses:
   *       200:
   *         description: OK
   *     x-amazon-another-integration: *another-integration
   */
  app.get('/richie-rich', () => {});
};

/**
 * The following annotation is an example of a jsdoc containing a yaml cotaining an anchor.
 * The place should not be relevant, and that's why it's later than its usage.
 *
 * @swagger
 * x-amazon-another-example:
 *  another-integration: &another-integration
 *    type: object
 *    x-amazon-another-example:
 *      httpMethod: POST
 *      passthroughBehavior: when_no_match
 *      type: aws_proxy
 *      uri: 'irrelevant'
 *
 */
