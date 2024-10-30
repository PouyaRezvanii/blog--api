const mongoose = require('mongoose')
const app = require('./app')
const socket = require('./socketIo')
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    const server = app.listen(process.env.PORT || 3000, () => {
        if(process.env.NODE_ENV === 'development'){
            console.log("server is up and running on port 3000")
        }
    })

    //const io = socketIO(server)

    socket.initSocket(server)

}).catch(err => {
    throw new Error('Database connection failed')
})