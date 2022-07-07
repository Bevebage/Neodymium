const express = require('express')
const path = require('path')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
})
let port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

let tick = 0 

io.on('connect', (socket) => {
  console.log(`user connected: ${socket.id}`)
})

setInterval(() => {
  io.sockets.emit('tick', tick)
  tick += 1
}, 1000/60)

server.listen(port, () => {
  console.log(`server listening on port: ${port}`)
})