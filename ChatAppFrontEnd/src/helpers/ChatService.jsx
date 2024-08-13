import { HubConnectionBuilder } from '@microsoft/signalr';

const token = localStorage.getItem("token");
const connection = new HubConnectionBuilder()
    .withUrl("https://683c-14-99-103-154.ngrok-free.app/chatHub", {
        accessTokenFactory: () => `Bearer ${token}`,
        withCredentials: false,

    })
    .withAutomaticReconnect([0, 2000, 10000, 30000])
    .build();

export default connection;