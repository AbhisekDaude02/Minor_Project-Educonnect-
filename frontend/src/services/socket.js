
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log(
    "Socket connected successfully:",
    socket.id
  );
});

socket.on("connect_error", (error) => {
  console.error(
    "Socket connection failed:",
    error.message
  );
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});
