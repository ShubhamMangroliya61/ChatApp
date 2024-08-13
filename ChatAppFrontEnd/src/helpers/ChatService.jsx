import { HubConnectionBuilder } from '@microsoft/signalr';


const getToken =() =>{
    const token = localStorage.getItem("token");
   return `Bearer ${token}`
}
const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7121/chatHub", {
        accessTokenFactory: ()=>getToken(),
        withCredentials: false,

    })
    .withAutomaticReconnect()
    .build();

export default connection;