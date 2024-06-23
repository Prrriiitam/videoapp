
const { join } = require("path");
const { Server } = require("socket.io");

const io = new Server(8000, {
    cors: true,
});
const emailtosocketidmap = new Map();
const socketidtoemailmap = new Map();

io.on("connection", (socket) => {
    console.log(`Socket connected`, socket.id);
    socket.on("room:join", data =>
    { 
    const{email, room} = data;
    emailtosocketidmap.set(email,socket.id);
    socketidtoemailmap.set(socket.id, email);
    io.to(room).emit("user:joined", {email, id: socket.id}); // Here when used wants to join to a room then we trigger this event and send the email and id to client
    socket.join(room); //Here when he wants to join then join
    io.to(socket.id).emit("room:join", data); // here first we storing the data comming from client to 2 maps and then on this line we again sending it to front end 
    });
    socket.on("user:call", ({to, offer}) =>{
        io.to(to).emit('incomming:call', {from: socket.id, offer}); // here we sending video to receipant
    });

    socket.on('call:accepted', ({to, ans}) => {
        io.to(to).emit('call:accepted', {from: socket.id, ans});
    });
});

