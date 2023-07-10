


export type WebsocketMessage = {
    type: string
}

export type HandshakeResponse = WebsocketMessage & {
    type: "handshake_response",
    result: "ok" | "fail"
}

export type ClientConnectToServerRequest = WebsocketMessage & {
    type: "handshake_request"
    name: string,
    password: string
}
export type ClientboundUserDisconnect = WebsocketMessage & {
    type: "user_disconnect"
    username: string
}

export type ClientboundUserConnect = WebsocketMessage & {
    type: "user_connect"
    username: string
}

export type ServerboundUserAccept = WebsocketMessage & {
    type: "user_accept"
    username: string,
}

export type FromClientUserKick = WebsocketMessage & {
    type: "user_kick"
    username: string,
}

export type WebboundUserAccept = WebsocketMessage & {
    type: "user_accept_web",
    result: "ok" | "fail"
}

export type FromClientSetAvailableKeys = WebsocketMessage & {
    type: "set_available_keys"
    username: string,
    keys: string[]
}

export type ToWebSetAvailableKeys = WebsocketMessage & {
    type: "set_available_keys"
    keys: string[]
}

export type FromWebUserKeyPress = WebsocketMessage & {
    type: "user_keypress"
    key: string
}
export type ClientboundUserKeyPress = FromWebUserKeyPress & { username: string }
export type ClientboundUserKeyUnpress = FromWebUserKeyUnpress & { username: string }

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