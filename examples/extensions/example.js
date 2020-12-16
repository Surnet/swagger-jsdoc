/* istanbul ignore file */

/**
 * Example taken from https://redocly.github.io/redoc/openapi.yaml
 *
 * @swagger
 * x-webhooks:
 *  newPet:
 *    post:
 *      summary: New pet
 *      description: Information about a new pet in the systems
 *      operationId: newPet
 *      tags:
 *        - pet
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Pet"
 *      responses:
 *        "200":
 *          description: Return a 200 status to indicate that the data was received successfully
 */
