const socketIO = require('socket.io')

const ORIGIN_URL =
    process.env.NODE_ENV !== 'production'
    ? "http://localhost:3000" 
    : process.env.PRODUCTION_URL

let io;

function initSocket(server){
    io = socketIO(server, { 
        cors:  {
            origin: ORIGIN_URL,
        },
    });

    io.on('connection', (socket) => {
        console.log('a new client connected')
        //console.log(socket)
        io.emit('welcome', 'welcome to my socketIO server... ' + socket.id)
    })
}

function getSocketIo(){
    if(!io){
        throw new Error('socket.IO not initialized!')
    }
    return io
}

module.exports = {
    initSocket,
    getSocketIo
}