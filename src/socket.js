import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

export const SocketContext = React.createContext();

const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const user = useSelector(state => state.user);
    useEffect(() => {
        if(user && user.info){
            let socketServer = io.connect("https://api.mxh.myserver.mobi", {
                query: {
                    accessToken: user.info.accessToken
                }
            });
            setSocket(socketServer);
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;