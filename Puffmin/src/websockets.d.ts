



declare module "ws" {
    interface WebSocket {
        noPing?: boolean,
        isAlive?: boolean
    }
}

export * from "ws"