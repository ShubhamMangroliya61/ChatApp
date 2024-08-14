import { HubConnectionBuilder ,HttpTransportType } from '@microsoft/signalr';


const getToken =() =>{
    const token = localStorage.getItem("token");
   return `Bearer ${token}`
}
const connection = new HubConnectionBuilder()
    .withUrl("https://27f9-14-99-103-154.ngrok-free.app/chatHub", {
        accessTokenFactory: ()=>getToken(),
        withCredentials: false,
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling
    })
    .withAutomaticReconnect()
    .build();

export default connection;