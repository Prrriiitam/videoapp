import {React, useEffect, useCallback, useState}  from 'react';
import ReactPlayer from "react-player";
import { useSocket } from '../context/SocketProvider';

const Room =() =>{
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();

    const handleUserJoined = useCallback(({email, id}) => {
        console.log(`user joined ${email} with id : ${id}`); // it will be displayed to userr 1 who has already joined 
        setRemoteSocketId(id);
    }, []);


    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        return()=>{
            socket.off("user:joined", handleUserJoined);
        }
    }, [socket, handleUserJoined]);


    const handlecalluser = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true, 
                video: true
            }
        );
        setMyStream(stream);
    }, []);
    return(
        <>
        <div style={{textAlign:"center"}}>
            <div>Room</div>
            <h1>{remoteSocketId ? 'CONNECTED' : 'NO ONE IN THE ROOM' }</h1>
            { remoteSocketId && <button onClick={handlecalluser}>Call</button> }
            <div>
            <h2>My Stream</h2>
            { 
            myStream && <ReactPlayer
            playing
            muted
            height="300px"
            width="500px"
            url={myStream} 
            />
            }
            </div>
        </div>    
        </>
    );
}
export default Room;
