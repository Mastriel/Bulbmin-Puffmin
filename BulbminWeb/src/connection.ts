import type {WebsocketMessage} from "communication/src/connections";
import {type Writable, writable} from "svelte/store";
import type {Fetchable} from "./fetchable";
import {fetchable} from "./fetchable";
import type {Key} from "bulbmin/src/util/input";

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

export const onCustom = <T extends WebsocketMessage>(socket: WebSocket, ev: T["type"], requiredParams: (keyof T)[], callback: (message: string, request: T) => void) => {
    socket.addEventListener("message", ({data}) => {
        let message = data
        let type = getType(message)
        if (type != ev) return
        const request = parseJSONMessage<T>(message, requiredParams)
        if (!request) return
        callback(message, request)
    })
}

export type WebClient = {
    ws: WebSocket,
    username: string,
    clientName: string,
    clientPassword: string,
    authenticated: boolean,
    availableKeys: Key[],
    clientPaused: boolean
}

export const heartbeatTimeout = (ws: WebSocket) => {
    ws.close(1000, "Timeout")
    console.log("Connection closed due to timeout")
}

export const webClient : Fetchable<WebClient | undefined> = fetchable(undefined)