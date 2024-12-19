import {WebSocket, WebSocketServer} from "ws";

export const createHeartbeatInterval = (server: WebSocketServer) => {
    return setInterval(() => {
        server.clients.forEach((ws: WebSocket) => {
            if (ws.noPing) return;
            ws.send("ping")
            if (!ws.isAlive) return ws.close(1000, "Server side heart failure");

            ws.isAlive = false;
        });
    }, 5000)
}


