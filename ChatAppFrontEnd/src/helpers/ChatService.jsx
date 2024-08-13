import { HubConnectionBuilder } from '@microsoft/signalr';

const token = localStorage.getItem("token");
const connection = new HubConnectionBuilder()
    .withUrl("http://192.168.2.152:6072/chatHub", {
        accessTokenFactory: () => `Bearer ${token}`,
        withCredentials: false,

    })
    .withAutomaticReconnect([0, 2000, 10000, 30000])
    .build();

export default connection;