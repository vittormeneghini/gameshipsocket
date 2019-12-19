const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
var players = {}
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', (req, res) => {
    res.sendfile(path.join(__dirname, 'public'))
})
io.on('connection', function (socket){
    console.log('usuario conectado')
    players[socket.id]={
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) === 0) ? 'red' : 'blue'
    }

    socket.emit('currentPlayers', players)
    socket.broadcast.emit('newPlayer', players[socket.id])
    socket.on('disconnect', function (){
        console.log('usuario desconectado')
        delete players[socket.id]
        io.emit('disconnect', socket.id)
    })
})
server.listen(8081, () => {
    console.log(`RUNNING GAME AT 8081`)
})