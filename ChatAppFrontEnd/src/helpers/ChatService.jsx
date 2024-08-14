import { HubConnectionBuilder} from '@microsoft/signalr';
const baseurl = import.meta.env.VITE_BASE_URL;

const getToken =() =>{
    const token = localStorage.getItem("token");
   return `Bearer ${token}`
}
const connection = new HubConnectionBuilder()
    .withUrl(`${baseurl}/chatHub`, {
        accessTokenFactory: ()=>getToken(),
        withCredentials: false,
        // headers:{"ngrok-skip-browser-warning": "69420" , "Access-Control-Allow-Origin":"*"}
    })
    .withAutomaticReconnect()
    .build();


export default connection;