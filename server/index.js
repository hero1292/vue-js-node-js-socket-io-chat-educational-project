const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const users = require('./utils/users')()
const host = '0.0.0.0'
const port = process.env.PORT || 3000
const app = express()
app.use(express.static(path.join(__dirname, '../dist')))
app.use(favicon(path.join(__dirname, '../src/assets/logo.png')))
const message = (name, text, id) => ({name, text, id})

const server = app.listen(port, host, () => {
  console.log(`Server has been started on port ${port}...`)
})

const io = require('socket.io')(server)

io.on('connection', socket => {
  socket.on('join', (user, callback) => {
    if (!user.name || !user.room) {
      return callback('Enter valid user data!')
    }
    callback({userId: socket.id})
    socket.join(user.room)
    users.remove(socket.id)
    users.add(socket.id, user.name, user.room)
    io.to(user.room).emit('users:update', users.getByRoom(user.room))
    socket.emit('message:new', message('Admin', `Welcome, ${user.name}!`))
    socket.broadcast.to(user.room).emit('message:new', message('Admin', `${user.name} joined!`))
  })

  socket.on('message:create', (data, callback) => {
    if (!data.text) {
      callback(`Message can't be empty!`)
    } else {
      const user = users.get(data.id)
      if (user) {
        io.to(user.room).emit('message:new', message(data.name, data.text, data.id))
      }
      callback()
    }
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.room).emit('message:new', message('Admin', `${user.name} left...`))
      io.to(user.room).emit('users:update', users.getByRoom(user.room))
    }
  })
})
