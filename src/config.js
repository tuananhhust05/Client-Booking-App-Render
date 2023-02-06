import { io } from "socket.io-client" 
let socket = io('https://api-booking-app-aws-ec2.onrender.com', {
    secure: true,
    enabledTransports: ["wss"],
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 100
});
export const socketCient = ()=>{
    return socket;
}

export const url = ()=>{
    return "https://api-booking-app-aws-ec2.onrender.com/api"
}