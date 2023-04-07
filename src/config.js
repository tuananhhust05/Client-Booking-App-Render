import { io } from "socket.io-client" 
let socket = io('https://adfulture.vn/', {
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
    return "https://adfulture.vn/api"
}

// http://localhost:8800

// let socket = io('http://localhost:8800', {
//     secure: true,
//     enabledTransports: ["wss"],
//     transports: ['websocket', 'polling'],
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     maxReconnectionAttempts: 100
// });
// export const socketCient = ()=>{
//     return socket;
// }

// export const url = ()=>{
//     return "http://localhost:8800/api"
// }