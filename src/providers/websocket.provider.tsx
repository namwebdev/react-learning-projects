"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io as ClientIO } from "socket.io-client";
import { SOCKET_API_URL } from "@/constants";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      throw new Error("NEXT_PUBLIC_SITE_URL is not set");
    }
    
    const socketInstance = ClientIO(siteUrl, {
      path: SOCKET_API_URL,
      addTrailingSlash: false,
    });
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
