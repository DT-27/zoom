 const express = require("express");
 const app = express();
const PORT = process.env.PORT || 1500;
 const server = require("http").Server(app);
const bodyparser = require("body-parser");
const ejs = require ("ejs");
const {v4:uuidv4} = require("uuid");
const io = require("socket.io")(server);
const {ExpressPeerServer} = require("peer");
const peerServer = ExpressPeerServer(server,{
    debug:true
})
app.use("/peerjs",peerServer)

app.use(bodyparser.urlencoded({ extended: false }))

app.use(bodyparser.json());

app.set("view engine","ejs");

app.set("views", __dirname + "/views");

app.use(express.static("public"));

app.get('/',(req,res)=>{
    res.render("join")
})

app.get("meeting",(req,res)=>{
res.redirect("/${uuidv4()}");
});



app.get("/:meeting",(req,res)=>{
res.render("room",{roomId:req.params.room});
});
io.on("connection",socket=>{
    socket.on("join-room",(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).emit("user-connected",userId)
       socket.on("message",message =>{
        io.to(roomId).emit("createMessage",message)
       })
    })
});



server.listen(PORT,()=>{
console.log("it works");
});
