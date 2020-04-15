/**
   * @swagger
   * definitions:
   *   Example:
   *     type: object
   *     required:
   *       - id
   *       - description
   *     properties:
   *       id:
   *         type: number
   *       description:
   *         type: string
   *       parameters:
   *         type: array
   *         items:
   *           $ref: '#/definitions/ExammpleParameter'
   */
  function swaggerDummyExample() { } // transpilation needs function to copy swagger annotation to dist directory
  export default interface Example {
    id: number;
    description: string;
    parameters: ExammpleParameter[];
  }

  /**
   * @swagger
   * definitions:
   *   ExammpleParameter:
   *     type: object
   *     required:
   *       - type
   *       - value
   *     properties:
   *       type:
   *         type: string
   *       value:
   *         type: string
   */
function swaggerDummyExammpleParameter() { } // transpilation needs function to copy swagger annotation to dist directory
export interface ExammpleParameter {
  type: string,
  value: string
}
