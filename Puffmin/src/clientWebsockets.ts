import {
    ClientConnectToServerRequest,
    HandshakeResponse, FromClientSetAvailableKeys, FromClientUserKick, ToWebSetAvailableKeys, FromClientSetPaused,
} from "communication/src/connections";
import {createHeartbeatInterval, getType, invalidRequest, onCustom, parseJSONMessage, server} from "./index";
import {WebSocket, WebSocketServer} from "ws";
import {WebClient} from "./webWebsockets";


export type ConnectedClient = ClientConnectToServerRequest & {
    connected: true,
    ws: WebSocket,
    broadcast: (message: string) => void,
    webClients: Set<WebClient>,
}

export let wss = new WebSocketServer({ noServer: true })


export const connectedClients : Set<ConnectedClient> = new Set<ConnectedClient>()

wss.on("connection", (ws) => {
    let client : ConnectedClient | undefined = undefined;
    (ws as any)["isAlive"] = true

    ws.once("message", (data: Buffer) => {
        if (getType(data) != "handshake_request") {
            if (!["noping", "pong"].includes(String(data))) {
                ws.close(1000, invalidRequest())
            }
            return
        }
        let request = parseJSONMessage<ClientConnectToServerRequest>(data, ["password", "name"])
        if (!request) {
            ws.close(1000, invalidRequest())
            return
        }

        if (Array.from(connectedClients.values()).map(it => it.name).includes(request.name)) {
            ws.close(1000, "Room name already taken.")
            return
        }

        client = {
            ...request,
            connected: true,
            ws: ws,
            broadcast: function(message: string) {
                for (let webClient of this.webClients) {
                    webClient.ws.send(message)
                }
            },
            webClients: new Set<WebClient>(),
        }

        connectedClients.add(client!)

        ws.send(JSON.stringify(<HandshakeResponse> {
            "type": "handshake_response",
            "result": "ok"
        }))

        const getUser = (username: string) : WebClient | undefined => {
            return Array.from(client!.webClients.values()).find(it => it.username.toLowerCase() == username.toLowerCase())
        }

        onCustom<FromClientUserKick>(ws, "user_kick", ["username"], (message, request) => {
            const user = getUser(request.username)
            if (!user) return

            user.ws.close(1000, `You have been kicked from ${client!.name}.`)
        })

        onCustom<FromClientSetPaused>(ws, "set_paused", ["paused"], (message, request) => {
            client!.broadcast(JSON.stringify(request))
        })

        onCustom<FromClientSetAvailableKeys>(ws, "set_available_keys", ["username", "keys"], (message, request) => {
            const user = getUser(request.username)
            if (!user) return

            user.authorizedKeys = request.keys
            user.ws.send(JSON.stringify(<ToWebSetAvailableKeys>{
                keys: request.keys,
                type: "set_available_keys"
            }))
        })
    })

    ws.on("message", (msg) => {
        console.log(String(msg))
        if (String(msg) != "pong") return
        (ws as any)["isAlive"] = true
    })

    ws.on("message", (msg) => {
        if (String(msg) != "noping") return
        (ws as any)["noPing"] = true
    })

    ws.on("close", () => {
        if (!client) return
        connectedClients.delete(client)
        client.webClients.forEach((it) => {
            it.ws.close(1000, "Client has ended the connection.")
        })
    })
})


const heartbeatInterval = createHeartbeatInterval(wss)

wss.on('close', () => clearInterval(heartbeatInterval))