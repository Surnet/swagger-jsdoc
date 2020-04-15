import express from 'express'
import { enableSwagger } from './swagger'
import { registerExampleApi } from './api/example-api'

const app = express()
const port = 8080

const API_VERSION = '0.0.1'

const server = app.listen(port, () => {
  console.log('listening on port ' + port)
})

/**
   * @swagger
   * /:
   *   get:
   *     description: Alive ping
   *     responses:
   *       200:
   *         description: I am alive!
   *         schema:
   *           type: string
   */
app.get('/', (req, res) => {
  res.send('I am alive!')
})

/**
   * @swagger
   * /version:
   *   get:
   *     description: Current API version
   *     responses:
   *       200:
   *         description: Returns the current API version (semantic versioning).
   *         schema:
   *           type: string
   */
app.get('/version', (req, res) => {
  res.header('Content-Type', 'text/plain')
  res.send(API_VERSION)
})

registerExampleApi(app)
enableSwagger(app)

process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.')
  await server.close()
})
