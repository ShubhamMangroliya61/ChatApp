import { HubConnectionBuilder } from '@microsoft/signalr';


const getToken =() =>{
    const token = localStorage.getItem("token");
   return `Bearer ${token}`
}
const connection = new HubConnectionBuilder()
    .withUrl("https://683c-14-99-103-154.ngrok-free.app/chatHub", {
        accessTokenFactory: ()=>getToken(),
        withCredentials: false,

    })
    .withAutomaticReconnect()
    .build();

export default connection;