const path =require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessages = require('./utils/messages')
const {userJoin,getCurUser,userLeave,getRoomUsers} =require('./utils/users')


const app =express();

const server = http.createServer(app);
const io = socketio(server);

// set the public folder as static
app.use(express.static(path.join(__dirname,'public')))

const botName  ="chatApp admin"


// run when client is connected
io.on("connection",socket=>{
  //  console.log("new websocket connection ...")

 socket.on('joinRoom',({username,room})=>{
 const user = userJoin(socket.id,username,room);
    socket.join(user.room)
    // welcome the current user

    socket.emit('message',formatMessages(botName,"welcome to CahtaApp"));

    // broadcasts when user leaves
    socket.broadcast.to(user.room).emit('message',formatMessages(botName,` ${user.username} has connested`));

    // send user and roominfo

    io.to(user.room).emit('roomusers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })
 })
   
  

  

    // listen for the message from client
    socket.on('chatMessage',msg=>{
        const user = getCurUser(socket.id);
        io.to(user.room).emit('message',formatMessages(`${user.username}`,msg));
    })

      // runs when user leaves
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
     io.emit('message',formatMessages(botName,`${user.username} has left the chat`));

      io.to(user.room).emit('roomusers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })
        }
       
    });
})
const PORT =3000 || process.env.PORT;

server.listen(PORT,()=>console.log(`Server is rinning at ${PORT}`));