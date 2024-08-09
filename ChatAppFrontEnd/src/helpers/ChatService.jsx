import { HubConnectionBuilder } from '@microsoft/signalr';

const token = localStorage.getItem("token");
const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7121/chatHub", {
        accessTokenFactory:()=> `Bearer ${token}`,
        withCredentials: false,
        
    })
    .withAutomaticReconnect()
    .build();

export default connection;