// Imaginary API helper
module.exports = function test(app) {
  /**
   * @swagger
   * definitions:
   *   Filter:
   *     description: Query filters
   *     type: array
   *     items:
   *       type: object
   *       properties:
   *         key:
   *           description: field name
   *           required: true
   *           type: string
   *         value:
   *           description: field value
   *           required: true
   *           type: {}
   *         op:
   *           description: comparaison operation
   *           required: false
   *           type: string
   *           enum: ["="]
   *   Time:
   *     description: Audit query time range
   *     type: object
   *     properties:
   *       to:
   *         description: time range end
   *         type: number
   *       from:
   *         description: time range start
   *         type: number
   */

  /**
   *  @swagger
   *  /api/v1/audits:
   *    post:
   *      operationId: addAudit
   *      tags: [Audits]
   *      description: Create a new audit
   *      consumes:
   *        - application/json
   *      produces:
   *        - application/json
   *      parameters:
   *        - in: body
   *          name: Audit initialization data
   *          description: The necessary initialization data to create an audit object
   *          schema:
   *            type: object
   *            properties:
   *              filter:
   *                $ref: '#/definitions/Filter'
   *              time:
   *                $ref: '#/definitions/Time'
   *      responses:
   *        200:
   *          description: return the created audit
   *        400:
   *          description: Invalid or missing parameters
   *        500:
   *          description: Server error
   */

  app.get('/', () => {});
};
