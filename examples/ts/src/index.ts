import express from 'express'

const app = express()
const port = 8080

const API_VERSION = '0.0.1'

const server = app.listen(port, () => {
  console.log('listening on port ' + port)
})

app.get('/', (req, res) => {
  res.send('I am alive!')
})

app.get('/version', (req, res) => {
  res.header('Content-Type', 'text/plain')
  res.send(API_VERSION)
})

process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.')
  await server.close()
})
