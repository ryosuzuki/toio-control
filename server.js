const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const app = express()
const server = http.Server(app)
const io = socketio(server)

const Toio = require('./toio')
const toio = new Toio()

const { NearestScanner } = require('@toio/scanner')


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})


server.listen(3000, () => {
  console.log('listening 3000')
  toio.io = io
  toio.init()
})

