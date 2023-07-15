import type {Writable, Readable, Subscriber, Invalidator, Unsubscriber} from "svelte/store";
import {writable} from "svelte/store";
import {type Fetchable, fetchable} from "./fetchable";
import {AppSettings} from "./settings";
import type {
    ClientboundUserConnect, ClientboundUserDisconnect, ClientboundUserKeyPress, ClientboundUserKeyUnpress,
    ClientConnectToServerRequest, FromClientSetAvailableKeys, FromClientSetPaused, FromClientUserKick,
    HandshakeResponse, ServerboundUserAccept
} from "communication/src/connections";
import {heartbeatTimeout, onCustom, parseJSONMessage} from "bulbmin-web/src/connection";
import type {Pressable} from "./input";
import {Input} from "./input";
import {notification} from "@tauri-apps/api";


export type ConnectedUser = {
    username: string,
    authenticated: boolean,
    availableKeys: Pressable[],
    keysHeld: Set<Pressable>
}

export class Client {
    public ws: WebSocket
    public connectedUsers: ConnectedUser[] = []

    public state: "connecting" | "connected"

    public constructor() {
        this.ws = new WebSocket(AppSettings["server-address"])

        let ws = this.ws

        this.state = "connecting"
        this.ws.addEventListener("open", () => {
            let timeout = setTimeout(() => heartbeatTimeout(ws), 5000)

            this.ws.send(JSON.stringify(<ClientConnectToServerRequest>{
                type: "handshake_request",
                name: AppSettings["room-name"],
                password: AppSettings["password"],
            }))
            this.ws.addEventListener("message", (evt) => {
                if (evt.data != "ping") return
                clearTimeout(timeout)
                timeout = setTimeout(() => heartbeatTimeout(ws), 5000)
                this.ws.send("pong")
            })

            onCustom<HandshakeResponse>(this.ws, "handshake_response", ["result"], (message, request) => {
                this.state = "connected"
                notification.sendNotification({title: "Bulbmin", body: `Sucessfully connected to ${AppSettings["server-address"]}`})
            })

            onCustom<ClientboundUserConnect>(this.ws, "user_connect", ["username"], (message, request) => {
                this.connectedUsers.push({
                    username: request.username,
                    availableKeys: [],
                    keysHeld: new Set<Pressable>(),
                    authenticated: false
                })
                notification.sendNotification({title: "Bulbmin", body: `${request.username} has requested to join.`})
                console.log("user connect!")
                this.update()
            })

            onCustom<ClientboundUserDisconnect>(this.ws, "user_disconnect", ["username"], (message, request) => {
                this.getUser(request.username)?.keysHeld?.forEach(async (it) => {
                    let shouldRelease = true
                    for (let user of this.connectedUsers) {
                        // someone else is pressing the button
                        if (user.username != request.username && user.keysHeld.has(it)) {
                            shouldRelease = false
                        }
                    }
                    if (shouldRelease) await Input.release(it)
                })
                notification.sendNotification({title: "Bulbmin", body: `${request.username} has left.`})

                this.connectedUsers = this.connectedUsers.filter(it => it.username != request.username)
                this.update()
            })

            onCustom<ClientboundUserKeyPress>(this.ws, "user_keypress", ["username", "key"], async (message, request) => {
                let user = this.getUser(request.username)

                if (this.paused) return
                if (!user?.availableKeys?.includes(<Pressable>request.key)) return

                user?.keysHeld.add(<Pressable>request.key)
                await Input.press(<Pressable>request.key)
                this.update()
            })

            onCustom<ClientboundUserKeyUnpress>(this.ws, "user_keyunpress", ["username", "key"], async (message, request) => {
                let user = this.getUser(request.username)!

                if (this.paused) return
                if (!user.keysHeld.has(<Pressable>request.key)) return

                user.keysHeld.delete(<Pressable>request.key)

                let shouldRelease = true
                for (let user of this.connectedUsers) {
                    // someone else is pressing the button
                    if (user.username != request.username && user.keysHeld.has(<Pressable>request.key)) {
                        shouldRelease = false
                    }
                }
                if (shouldRelease) await Input.release(<Pressable>request.key)
                this.update()
            })
        })

        this.ws.addEventListener("error", () => {
            client.set(undefined)
            connectionError.set("A connection error has occurred.")
        })

        this.ws.addEventListener("close", (msg) => {
            client.set(undefined)

            connectionError.set("Connection closed: " + msg.reason)
        })

    }

    public setAvailableKeys(user: ConnectedUser, keys: Pressable[]) {
        this.ws.send(JSON.stringify(<FromClientSetAvailableKeys>{
            type: "set_available_keys",
            username: user.username,
            keys: keys
        }))
        user.availableKeys = keys
        this.update()
    }

    public kick(user: ConnectedUser) {
        this.ws.send(JSON.stringify(<FromClientUserKick>{
            type: "user_kick",
            username: user.username
        }))
    }

    public accept(user: ConnectedUser) {
        this.ws.send(JSON.stringify(<ServerboundUserAccept>{
            type: "user_accept",
            username: user.username
        }))
        user.authenticated = true
        this.update()
    }

    public deny(user: ConnectedUser) {
        this.ws.send(JSON.stringify({
            type: "user_deny",
            username: user.username
        }))
        this.update()

    }

    public getUser(name: string) : ConnectedUser | undefined {
        return this.connectedUsers.find(it => it.username == name)
    }

    private update = () => client.update(it => it)

    private _paused : boolean = false
    public get paused() { return this._paused }
    public set paused(value) {
        this._paused = value;
        for (let user of this.connectedUsers) {
            for (let key of user.keysHeld) {
                Input.release(key).then(_ => {})
            }
            user.keysHeld.clear()
        }
        this.ws.send(JSON.stringify(<FromClientSetPaused>{
            type: "set_paused",
            paused: value
        }))
        this.update()
    }
}

export const client : Fetchable<Client | undefined> = fetchable()
export const connectionError : Writable<string | undefined> = fetchable()
