import {
    ClientConnectToServerRequest,
    HandshakeResponse, FromClientUserKick,
    WebsocketMessage
} from "communication/src/connections";
import {WebSocketServer, WebSocket} from "ws";

import * as url from "url";
import * as httpServer from "http";
import {wss, wss as clientWss} from "./clientWebsockets"
import {wss as webWss} from "./webWebsockets"


export const server = httpServer.createServer()





server.on('upgrade', function upgrade(request, socket, head) {
    // TODO make it not do that
    // noinspection JSDeprecatedSymbols
    const { pathname } = url.parse(request.url!);

    console.log("upgrade request coming through " + pathname)
    if (pathname === '/client/connect') {
        clientWss.handleUpgrade(request, socket, head, function done(ws) {
            clientWss.emit('connection', ws, request);
        });
    } else if (pathname === '/web/connect') {
        webWss.handleUpgrade(request, socket, head, function done(ws) {
            webWss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(8080)

console.log("Server started")

export const invalidRequest = (reason?: string) => {
    return "Handshake failed: " + (reason ?? "Bad first message.")
}


export const getType = (message: Buffer) : string | undefined => {
    return parseJSONMessage<WebsocketMessage>(message)?.type
}

export const parseJSONMessage = <T extends {[k: string]: any}>(message: Buffer, requiredParams: (keyof T)[] = []) : T | undefined => {
    let value : T
    try {
        value = JSON.parse(String(message))
    } catch (e) {
        return undefined
    }
    for (let param of requiredParams) {
        if (value[param] == undefined) return undefined
    }
    return value
}

export const onCustom = <T extends WebsocketMessage>(socket: WebSocket, ev: T["type"], requiredParams: (keyof T)[], callback: (message: Buffer, request: T) => void) => {
    socket.on("message", (message: Buffer) => {
        let type = getType(message)
        if (type != ev) return
        const request = parseJSONMessage<T>(message, requiredParams)
        if (!request) return
        callback(message, request)
    })
}


