import {
    ClientboundUserConnect,
    ClientboundUserDisconnect,
    FromWebUserKeyPress,
    ClientConnectToServerRequest,
    HandshakeResponse,
    ServerboundUserAccept,
    WebboundUserAccept,
    WebConnectToServerRequest,
    WebsocketMessage,
    ClientboundUserKeyPress,
    FromWebUserKeyUnpress,
    ClientboundUserKeyUnpress
} from "communication/src/connections";
import {createHeartbeatInterval, getType, invalidRequest, onCustom, parseJSONMessage} from "./index";
import {WebSocketServer, WebSocket} from "ws";
import {ConnectedClient, connectedClients} from "./clientWebsockets";
import https from "https"



export type WebClient = {
    ws: WebSocket,
    parent: ConnectedClient,
    username: string,
    authorized: boolean,
    authorizedKeys: string[]
}

export let wss = new WebSocketServer({noServer: true})


wss.on("connection", (webWs: WebSocket) => {

    let webClient : WebClient | undefined = undefined;
    (webWs as any)["isAlive"] = true
    webWs.once("message", (data: Buffer) => {
        if (getType(data) != "handshake_request_web") {
            webWs.close(1000, "Invalid first request.")
            return
        }
        let request = parseJSONMessage<WebConnectToServerRequest>(data, ["serverName", "serverPassword", "clientUsername"])
        if (!request) {
            webWs.close(1000, "Required fields are not set.")
            return
        }


        const client = Array.from(connectedClients.values()).find(it => it.name == request?.serverName && it.password == request?.serverPassword)
        if (client == undefined) {
            webWs.close(1001, invalidRequest("No client by this name/password exists."))
            return
        }

        // a user by this name already exists.
        if (Array.from(client.webClients.values()).find(it => it.username == request?.clientUsername)) {
            webWs.close(1001, invalidRequest("This username is already taken."))
        }

        client.ws.send(JSON.stringify(<ClientboundUserConnect>{
            type: "user_connect",
            username: request.clientUsername
        }))

        webClient = {
            ws: webWs,
            parent: client,
            username: request.clientUsername,
            authorized: false,
            authorizedKeys: []
        }

        client.webClients.add(webClient)

        const needsAuth = (fun: (message: Buffer) => void) : ((message: Buffer) => void) => {
            return (message: Buffer) => {
                if (webClient?.authorized) fun(message)
            }
        }

        const needsAuthCustom = <T extends WebsocketMessage>(fun: (message: Buffer, request: T) => void) : ((message: Buffer, request: T) => void) => {
            return (message: Buffer, request: T) => {
                if (webClient?.authorized) fun(message, request)
            }
        }

        const authorize = (message: Buffer) => {
            console.log(`Accepting user`)

            let type = getType(message)
            if (!type) return
            if (type != "user_accept" && type != "user_deny") return

            let request = parseJSONMessage<WebsocketMessage & {username: string}>(message, ["username"])
            if (!request) return


            if (request.username != webClient?.username) return

            if (request.type == "user_deny") {
                webWs.close(1000, "Client declined access.")
                return
            }

            webClient!.authorized = true
            webWs.send(JSON.stringify(<WebboundUserAccept>{
                type: "user_accept_web",
                result: "ok"
            }))
            client.ws.off("message", authorize)
        }
        client.ws.on("message", authorize)

        webWs.on("message", needsAuth((message) => {
            let jsonMessage = parseJSONMessage(message)
            if (!jsonMessage) return;
            if (!jsonMessage["custom"]) return;

            jsonMessage["from"] = webClient?.username
            client.ws.send(JSON.stringify(jsonMessage))
        }))

        onCustom<FromWebUserKeyPress>(webWs, "user_keypress", ["key"], needsAuthCustom((message, request) => {
            client.ws.send(JSON.stringify(<ClientboundUserKeyPress>{
                key: request.key,
                username: webClient!.username,
                type: "user_keypress"
            }))
        }))

        onCustom<FromWebUserKeyUnpress>(webWs, "user_keyunpress", ["key"], needsAuthCustom((message, request) => {
            client.ws.send(JSON.stringify(<ClientboundUserKeyUnpress>{
                key: request.key,
                username: webClient!.username,
                type: "user_keyunpress"
            }))
        }))
    })

    webWs.on("message", (msg) => {
        if (String(msg) != "pong") return
        (webWs as any)["isAlive"] = true
    })

    webWs.on("close", () => {
        if (!webClient) return
        webClient.parent.ws.send(JSON.stringify(<ClientboundUserDisconnect>{
            type: "user_disconnect",
            username: webClient.username
        }))
        webClient.parent.webClients.delete(webClient)
    })
})

const heartbeatInterval = createHeartbeatInterval(wss)

wss.on('close', () => clearInterval(heartbeatInterval))