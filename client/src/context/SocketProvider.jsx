import React, {createContext, useContext, useMemo} from "react";
import {io} from "socket.io-client";


const socketContext = createContext(null)


// useSocket is our own hook and wherever we want to use socket we jsut say useSocket and then we cam easily use the socket
export const useSocket =()=>{
    const socket = useContext(socketContext);
    return socket;
}




export const SocketProvider = (props) => {
    const socket = useMemo(()=>io("localhost:8000"), [])
    return(
        <socketContext.Provider value={socket}>
         {props.children}  {/* whatever user enters */}
        </socketContext.Provider>
    )
}

