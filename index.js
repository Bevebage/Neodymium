import express from 'express'
import http from 'http'
import cors from 'cors'
import { WebSocketServer } from 'ws'

import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const app = express()
app.use(cors())

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.static(join(__dirname, 'client/build')))

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'client/build/index.html'))
})

const port = process.env.PORT || 3000
const server = http.createServer(app)
const wss = new WebSocketServer({
  server: server
})

const dataFile = join(__dirname, 'data.json')
const adapter = new JSONFile(dataFile)
const db = new Low(adapter)

await db.read()

db.data ||= { tick: 0 }

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data)
  })
}

wss.on('connection', (ws) => {
  console.log(`user connected ${db.data.tick}`)
})

setInterval(() => {
  wss.broadcast(db.data.tick)
  db.data.tick += 1
}, 1)

setInterval(() => {
  db.write()
}, 300000)

server.listen(port, () => {
  console.log(`server listening on port: ${port}`)
})