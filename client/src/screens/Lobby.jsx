import React, { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {useSocket} from "../context/SocketProvider"
const Lobby = () => {
  const [email,setEmail] = useState("")
  const [room,setRoom] = useState("")

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback((e)=>{
    e.preventDefault();
    socket.emit("room:join", {email, room})// here we are sending data to backend for registering
    console.log({
      email,
      room,
    });
  }, [email, room, socket]);

  const handleJoinroom = useCallback((data) => {
    const {email, room} = data;
    navigate(`room/${room}`);
  }, [navigate]);

  // here in this useeffect we are handling the data which was send to backend for register and then comming to frontend so here we handlinh this comming data

  useEffect(() =>{
    socket.on("room:join", handleJoinroom);
    return() => {
      socket.off("room:join", handleJoinroom)
    }
  }, [socket, handleJoinroom]);




  return (
    <><h1 style={{textAlign:"center"}}>Lobby</h1>
    <div style={{textAlign:"center"}}>
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email ID</label>
      <input type="email"
       id='email'
       value={email} 
       onChange={(e) => setEmail(e.target.value)}/>
      <br />
      <label htmlFor="room">Room Number</label>
      <input type="text" 
       id='room'
       value={room}
       onChange={(e) => setRoom(e.target.value)}
       />
      <br />
      <button>Join</button>
</form>
</div>
    </>
    
  )
}

export default Lobby