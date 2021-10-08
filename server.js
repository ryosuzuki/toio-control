const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const app = express()
const server = http.Server(app)
const io = socketio(server)

const Toio = require('./toio')
const toio = new Toio()

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/simulator', (req, res) => {
  res.sendFile(path.join(__dirname + '/simulator.html'))
})


server.listen(3000, () => {
  console.log('listening 3000')
  toio.io = io
  toio.init()
})

