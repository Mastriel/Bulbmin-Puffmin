


export type WebsocketMessage = {
    type: string
}

type UserAction = { username: string }

export type HandshakeResponse = WebsocketMessage & {
    type: "handshake_response",
    result: "ok" | "fail"
}

export type ClientConnectToServerRequest = WebsocketMessage & {
    type: "handshake_request"
    name: string,
    password: string
}
export type ClientboundUserDisconnect = WebsocketMessage & UserAction & {
    type: "user_disconnect"
}

export type ClientboundUserConnect = WebsocketMessage & UserAction & {
    type: "user_connect"
}

export type ServerboundUserAccept = WebsocketMessage & UserAction & {
    type: "user_accept"
}

export type FromClientUserKick = WebsocketMessage & UserAction & {
    type: "user_kick"
}

export type WebboundUserAccept = WebsocketMessage & {
    type: "user_accept_web",
    result: "ok" | "fail"
}

export type FromClientSetAvailableKeys = WebsocketMessage & UserAction & {
    type: "set_available_keys"
    keys: string[]
}

export type ToWebSetAvailableKeys = WebsocketMessage & {
    type: "set_available_keys"
    keys: string[]
}

export type FromClientSetPaused = WebsocketMessage & {
    type: "set_paused",
    paused: boolean,
}

export type ToWebSetPaused = FromClientSetPaused


export type FromWebUserKeyPress = WebsocketMessage & {
    type: "user_keypress"
    key: string
}
export type ClientboundUserKeyPress = FromWebUserKeyPress & UserAction
export type ClientboundUserKeyUnpress = FromWebUserKeyUnpress & UserAction

export type FromWebUserKeyUnpress = WebsocketMessage & {
    type: "user_keyunpress"
    key: string
}

export type WebConnectToServerRequest = WebsocketMessage & {
    type: "handshake_request_web"
    serverName: string,
    serverPassword: string,
    clientUsername: string
}

export type WebConnectToServerResponse = WebsocketMessage & {
    type: "handshake_response_web",
    result: "ok" | "fail"
}