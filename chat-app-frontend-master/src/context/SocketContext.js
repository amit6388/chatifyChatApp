import { getAuth } from "@/store/slices/auth";
import React, { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import io from 'socket.io-client'
const socketContext = createContext();
export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
    const auth = useSelector(getAuth)
  const setSocketConnection = () => {
    if (auth) {
      const socketInstance = io.connect(process.env.NEXT_PUBLIC_API_URL, {
        auth: {
          email: auth.email,
          username: auth.username,
          _id: auth._id,
        },
        transports: ["websocket", "polling"],
      });
      setSocket(socketInstance);
    }
  };
  const disconnectSocket = () => {
    socket.disconnect();
  };
  return (
    <socketContext.Provider
      value={{ socket, disconnectSocket, setSocketConnection }}
    >
      {children}
    </socketContext.Provider>
  );
}

export const useSocketContext = () => useContext(socketContext);
