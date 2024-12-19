<script lang="ts">


    import {heartbeatTimeout, onCustom, parseJSONMessage, webClient, type WebClient} from "../connection";
    import type {
        ToWebSetAvailableKeys, ToWebSetPaused,
        WebboundUserAccept,
        WebConnectToServerRequest
    } from "communication/src/connections";
    import {pressedKeys, sendKey, sendKeyUp} from "../input";
    import {client} from "bulbmin/src/util/connection";
    import {ALL_PRESSABLES, type Key} from "bulbmin/src/util/input";

    let username : string
    let clientName : string
    let clientPassword : string

    let button : HTMLButtonElement

    let status : "idle" | "connecting" | "connected" = "idle"

    let url = import.meta.env.DEV ? import.meta.env.VITE_WEBSOCKET_SERVER_DEV : import.meta.env.VITE_WEBSOCKET_SERVER
    console.log()

    let declinedConnection : string = undefined



    let tempWebClient : WebClient = undefined

    const connect = () => {
        if (button) button.disabled = true

        let webSocket = new WebSocket(url)

        let timeout = setTimeout(heartbeatTimeout, 5000)

        webSocket.addEventListener("error", () => {
            declinedConnection = "An error occurred connecting to the WebSocket. Is the server up?"
            status = "idle"
            if (button) button.disabled = false
        })

        webSocket.addEventListener("close", () => {
            status = "idle"
            if (button) button.disabled = false
        })

        webSocket.addEventListener("message", (evt) => {
            if (evt.data != "ping") return
            clearTimeout(timeout)
            timeout = setTimeout(heartbeatTimeout, 5000)
            webSocket.send("pong")
        })

        webSocket.addEventListener("open", (evt) => {
            webSocket.send(JSON.stringify(<WebConnectToServerRequest>{
                type: "handshake_request_web",
                serverName: clientName,
                serverPassword: clientPassword,
                clientUsername: username
            }))

            tempWebClient = {
                ws: webSocket,
                username,
                clientName,
                clientPassword,
                authenticated: false,
                availableKeys: [],
                clientPaused: false
            }

            status = "connecting"

            const authenticate = (message: MessageEvent) => {
                let msg = parseJSONMessage<WebboundUserAccept>(message.data)
                if (msg == undefined) return
                tempWebClient.authenticated = true
                webSocket.removeEventListener("message", authenticate)
                webClient.set(tempWebClient)
                status = "connected"

                onCustom<ToWebSetAvailableKeys>(webSocket, "set_available_keys", ["keys"], (message, request) => {
                    webClient.update((it) => {
                        it.availableKeys = request.keys as Key[]
                        return it
                    })
                })
                onCustom<ToWebSetPaused>(webSocket, "set_paused", ["paused"], (message, request) => {
                    console.log(`should pause: ${request.paused}`)
                    webClient.update((it) => {
                        it.clientPaused = request.paused
                        return it
                    })
                })
            }
            webSocket.addEventListener("message", authenticate)

            webSocket.addEventListener("close", (evt) => {
                declinedConnection = evt.reason
                status = "idle"
                $webClient = undefined
                if (button) button.disabled = false
            })
        })
    }
</script>

{#if status === "idle"}
    <main class="h-full items-center justify-center flex flex-col">
        <div class="card bg-leaf-700 bg-opacity-50 rounded drop-shadow-xl border-leaf-500 border w-[350px] md:w-[400px]">
            <h1>Connect</h1>
            <form class="text-left mt-10" on:submit|preventDefault={connect}>
                <p>Username <span class="text-red-400">*</span></p>
                <input class="mt-1" type="text" bind:value={username} placeholder="Username">

                <hr class="mt-5 border-leaf-500">

                <p class="mt-4">Client Name <span class="text-red-400">*</span></p>
                <input class="mt-1" type="text" bind:value={clientName} placeholder="Client Name">

                <p class="mt-5">Client Password <span class="text-red-400">*</span></p>
                <input class="mt-1" type="password" bind:value={clientPassword} placeholder="Client Password">

                <button class="mt-16" on:click={connect} bind:this={button}>Connect</button>
                {#if declinedConnection}
                    <div class="p-2 red border rounded mt-5">
                        <p class="text-white text-sm">⚠️ {declinedConnection}</p>
                    </div>
                {/if}
            </form>
        </div>
        <a target="_blank" href="https://github.com/Mastriel/Bulbmin-Puffmin/releases" class="mt-3">Download the client</a>
    </main>
{:else if status === "connecting"}
    <main class="mt-4 justify-center flex">
        <div class="card-sm p-1 bg-leaf-700 bg-opacity-50 rounded drop-shadow-xl border-leaf-500 border">
            <h1>Connecting...</h1>
            <p class="mt-3">Waiting for {tempWebClient.clientName}</p>
        </div>
    </main>
{:else}
    <main class="mt-4 justify-center flex">
        <div class="card-sm bg-leaf-700 bg-opacity-50 rounded drop-shadow-xl border-leaf-500 border">
            <h1>Connected!</h1>
            {#if $webClient.clientPaused}
                <h3 class="text-red-400">Paused</h3>
            {/if}
        </div>
    </main>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-16 select-none">
        {#each $webClient.availableKeys as key}
            <div on:mousedown={() => sendKey(key)}
                 on:mouseup={() => sendKeyUp(key)}
                 on:touchstart|preventDefault={() => sendKey(key)}
                 on:touchend|preventDefault={() => sendKeyUp(key)}
                 role="button"
                 tabindex="0"
                 class="inline-block cursor-pointer key mt-4 bg-leaf-700 bg-opacity-50 border border-leaf-500 rounded drop-shadow-md"
                 class:active={$pressedKeys[key] === true}>{key}</div>
        {/each}
    </div>
{/if}

<style>

    div.active {
        @apply bg-leaf-500 border-leaf-400;
    }

    .card {
        padding: 3em;
        backdrop-filter: blur(5px);
    }

    .card-sm {
        padding: 1em;
        width: 400px;
        backdrop-filter: blur(5px);
    }

    .red {
        background-color: #938650;
        border-color: #d9c471;
    }

    .key {
        padding: 1em;
        margin-left: 0.5em;
        margin-right: 0.5em;
        backdrop-filter: blur(5px);
    }
</style>