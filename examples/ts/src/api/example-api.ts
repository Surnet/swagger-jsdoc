import Example from "@/model/example"

const example: Example = {
  id: 1,
  description: "The example.",
  parameters: [
    {
      type: "simple",
      value: "API"
    }
  ]
}

export function registerExampleApi(app: any) {

  /**
   * @swagger
   * /example:
   *   get:
   *     description: Get an example.
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: The example.
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Example'
   */
  app.get('/example', (req: any, res: any) => {
    res.header('Content-Type', 'application/json')
    res.json(example)
  })
}
