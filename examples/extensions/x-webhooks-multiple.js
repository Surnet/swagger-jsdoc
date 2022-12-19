/* istanbul ignore file */

/**
 * Example of cat
 *
 * @swagger
 * x-webhooks:
 *  newCat:
 *    post:
 *      description: Information about a new cat in the systems
 *      tags:
 *        - pet
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Cat"
 *      responses:
 *        "200":
 *          description: Return a 200 status to indicate that the data was received successfully
 */

/**
 * Example of dog
 *
 * @swagger
 * x-webhooks:
 *  newDog:
 *    post:
 *      description: Information about a new dog in the systems
 *      tags:
 *        - pet
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Dog"
 *      responses:
 *        "200":
 *          description: Return a 200 status to indicate that the data was received successfully
 */
