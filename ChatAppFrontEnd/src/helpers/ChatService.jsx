import { HubConnectionBuilder} from '@microsoft/signalr';


const getToken =() =>{
    const token = localStorage.getItem("token");
   return `Bearer ${token}`
}
const connection = new HubConnectionBuilder()
    .withUrl("https://5771-14-99-103-154.ngrok-free.app/chatHub", {
        accessTokenFactory: ()=>getToken(),
        withCredentials: false,
        // headers:{"ngrok-skip-browser-warning": "69420" , "Access-Control-Allow-Origin":"*"}
    })
    .withAutomaticReconnect()
    .build();


export default connection;