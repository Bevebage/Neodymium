const express = require('express')
const http = require('http')
const path = require('path')
const cors = require('cors')
const { WebSocketServer } = require('ws')

const app = express()
app.use(cors())

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

const port = process.env.PORT || 3000
const server = http.createServer(app)
const wss = new WebSocketServer({
  server: server
})

let tick = 0 

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data)
  })
}

wss.on('connection', (ws) => {
  console.log(`user connected ${tick}`)
})

setInterval(() => {
  wss.broadcast(tick)
  tick += 1
}, 10)

server.listen(port, () => {
  console.log(`server listening on port: ${port}`)
})