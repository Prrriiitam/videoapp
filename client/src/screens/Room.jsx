import {React, useEffect, useCallback, useState}  from 'react';
import ReactPlayer from "react-player";
import { useSocket } from '../context/SocketProvider';
import Peer from '../Service/Peer';

const Room =() =>{
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();

    const handleUserJoined = useCallback(({email, id}) => {
        console.log(`user joined ${email} with id : ${id}`); // it will be displayed to userr 1 who has already joined 
        setRemoteSocketId(id);
    }, []);

    const handleIncommingCall = useCallback(async ({from, offer}) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true, 
                video: true
            }
        );
        setMyStream(stream);

        console.log(`incomming call from ${from} with offer ${offer}`);
        const ans  = await Peer.getAnswer(offer);
        socket.emit('call:accepted', {to: from, ans});  

    }, [socket]);

    const handlecallAccepted = useCallback(async({from, ans}) => {
        Peer.setLocalDescription(ans);
        console.log('Call Accepted');
    }, [])

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on('call:accepted', handlecallAccepted);
        return()=>{
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off('call:accepted', handlecallAccepted);
        }
    }, [socket, handleUserJoined, handleIncommingCall, handlecallAccepted]);


    const handlecalluser = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true, 
                video: true
            }
        );
        const offer = await Peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer }); // we created a offer and send it to remotesid means to other user
        setMyStream(stream);
    }, [remoteSocketId, socket]);
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
