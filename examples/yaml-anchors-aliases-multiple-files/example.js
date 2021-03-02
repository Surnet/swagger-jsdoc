/* istanbul ignore file */

module.exports = (app) => {
  /**
   * @openapi
   * /aws:
   *   post:
   *     summary: sample aws-specific route
   *     description: contains a reference outside this file
   *     security: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *             properties:
   *              firstName: *firstName
   *              lastName: *lastName
   *     responses:
   *       200:
   *         description: OK
   */
  app.post('/aws', () => {});

  /**
   * @openapi
   * /aws:
   *   put:
   *     summary: sample aws-specific route for putting requests
   *     security: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *             properties:
   *              firstName: *firstName
   *     responses:
   *       200:
   *         description: OK
   */
  app.put('/aws');
};
