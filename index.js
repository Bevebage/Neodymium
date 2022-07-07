const express = require('express')
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

let tick = 0 

io.on('connect', (socket) => {
  console.log(`user connected: ${socket.id}`)
})

setInterval(() => {
  io.sockets.emit('tick', tick)
  tick += 1
}, 1000/60)

server.listen(3001, () => {
  console.log(`server listening on port: ${3001}`)
})