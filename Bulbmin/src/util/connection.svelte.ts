import {type StatePtr, useStatePtr} from "./fetchable.svelte";
import {AppSettings} from "./settings";
import type {
    ClientboundUserConnect, ClientboundUserDisconnect, ClientboundUserKeyPress, ClientboundUserKeyUnpress,
    ClientConnectToServerRequest, FromClientSetAvailableKeys, FromClientSetPaused, FromClientUserKick,
    HandshakeResponse, ServerboundUserAccept
} from "communication/src/connections";
import {onCustom, parseJSONMessage} from "bulbmin-web/src/connection";
import type {Pressable} from "./input";
import {Input} from "./input";
import {toaster} from "./toast.svelte";
import {SvelteSet} from "svelte/reactivity";


export type ConnectedUser = {
    username: string,
    authenticated: boolean,
    availableKeys: Pressable[],
    keysHeld: Set<Pressable>
}

export class Client {
    public ws: WebSocket = $state.raw(undefined!)
    public connectedUsers: ConnectedUser[] = $state([])

    public state: "connecting" | "connected"

    public constructor() {
        this.ws = new WebSocket(AppSettings["server-address"])

        let ws = this.ws

        this.state = "connecting"
        this.ws.addEventListener("open", () => {

            this.ws.send(JSON.stringify(<ClientConnectToServerRequest>{
                type: "handshake_request",
                name: AppSettings["room-name"],
                password: AppSettings["password"],
            }))

            onCustom<HandshakeResponse>(this.ws, "handshake_response", ["result"], (message, request) => {
                this.state = "connected"
                toaster.$.push({body: `Sucessfully connected to Puffmin`})
            })

            onCustom<ClientboundUserConnect>(this.ws, "user_connect", ["username"], (message, request) => {
                const user = $state({
                    username: request.username,
                    availableKeys: [],
                    keysHeld: new SvelteSet<Pressable>(),
                    authenticated: false
                })
                this.connectedUsers.push(user)
                toaster.$.push({body: `${request.username} has requested to join.`})
                console.log("user connect!")
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
                toaster.$.push({body: `${request.username} has left.`})

                this.connectedUsers = this.connectedUsers.filter(it => it.username != request.username)
            })

            onCustom<ClientboundUserKeyPress>(this.ws, "user_keypress", ["username", "key"], async (message, request) => {
                let user = this.getUser(request.username)

                if (this.paused) return
                if (!user?.availableKeys?.includes(<Pressable>request.key)) return

                user?.keysHeld.add(<Pressable>request.key)
                await Input.press(<Pressable>request.key)
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
            })
        })

        this.ws.addEventListener("error", () => {
            client.$ = undefined
            connectionError.$ = "A connection error has occurred."
        })

        this.ws.addEventListener("close", (msg) => {
            client.$ = undefined

            console.log("Connection closed: ", msg)

            connectionError.$ = "Connection closed: " + msg.reason
        })

    }

    public setAvailableKeys(user: ConnectedUser, keys: Pressable[]) {
        this.ws.send(JSON.stringify(<FromClientSetAvailableKeys>{
            type: "set_available_keys",
            username: user.username,
            keys: keys
        }))
        user.availableKeys = keys
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
    }

    public deny(user: ConnectedUser) {
        this.ws.send(JSON.stringify({
            type: "user_deny",
            username: user.username
        }))
    }

    public getUser(name: string) : ConnectedUser | undefined {
        return this.connectedUsers.find(it => it.username == name)
    }

    private _paused : boolean = $state(false)
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
    }

    public close() {
        this.ws.close(1000, "You disconnected from Puffmin")
    }
}

export const client : StatePtr<Client | undefined> = useStatePtr(undefined!)
export const connectionError : StatePtr<string | undefined> = useStatePtr(undefined!)
