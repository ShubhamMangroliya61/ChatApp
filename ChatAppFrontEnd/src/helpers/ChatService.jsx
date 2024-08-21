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
    })
    .withAutomaticReconnect()
    .build();


export default connection;