const express = require("express");
const { ExpressPeerServer } = require("peer");
const { Socket } = require("socket.io");


const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require("uuid");
const peerServer = ExpressPeerServer(server,{ 
  debug : true
});
app.use('/peerjs',peerServer);

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomid: req.params.room });
});

io.on('connection',socket=>{
  socket.on('join-room',(roomid,userId) => {
   socket.join(roomid);
   socket.to(roomid).emit('user-connected', userId);
  })
})





server.listen(3000);
