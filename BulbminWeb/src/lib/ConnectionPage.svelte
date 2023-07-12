<script lang="ts">


    import {heartbeatTimeout, onCustom, parseJSONMessage, webClient, type WebClient} from "../connection";
    import type {
        ToWebSetAvailableKeys,
        WebboundUserAccept,
        WebConnectToServerRequest
    } from "communication/src/connections";
    import {pressedKeys, sendKey, sendKeyUp} from "../input";

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

        webSocket.addEventListener("error", (evt) => {
            declinedConnection = "An error occurred connecting to the WebSocket. Is the server up?"
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
                availableKeys: []
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
                        it.availableKeys = request.keys
                        return it
                    })
                })
            }
            webSocket.addEventListener("message", authenticate)

            webSocket.addEventListener("close", (evt) => {
                declinedConnection = evt.reason
                status = "idle"
                if (button) button.disabled = false
            })
        })
    }
</script>

{#if status === "idle"}
    <main class="items-center justify-center flex flex-col">
        <div class="card bg-slate-700 bg-opacity-50 rounded drop-shadow-xl border-slate-600 border">
            <h1>Connect</h1>
            <div class="text-left mt-10">
                <p>Username <span class="text-red-400">*</span></p>
                <input class="mt-1" type="text" bind:value={username} placeholder="Username">

                <hr class="mt-5 border-slate-600">

                <p class="mt-4">Client Name <span class="text-red-400">*</span></p>
                <input class="mt-1" type="text" bind:value={clientName} placeholder="Client Name">

                <p class="mt-5">Client Password <span class="text-red-400">*</span></p>
                <input class="mt-1" type="password" bind:value={clientPassword} placeholder="Client Password">

                <button class="mt-16" on:click={connect} bind:this={button}>Connect</button>
                {#if declinedConnection}
                    <div class="p-2 bg-red-300 border rounded border-red-200 mt-5">
                        <p class="text-red-500 text-sm">❌ {declinedConnection}</p>
                    </div>
                {/if}
            </div>
        </div>
        <a target="_blank" href="https://github.com/Mastriel/Bulbmin-Puffmin/releases" class="mt-2">Download the client</a>
    </main>
{:else if status === "connecting"}
    <main class="items-center justify-center flex">
        <div class="card bg-slate-700 bg-opacity-50 rounded drop-shadow-xl border-slate-600 border">
            <h1>Connecting...</h1>
            <p>Waiting for {tempWebClient.clientName}</p>
        </div>
    </main>
{:else}
    <main class="items-center justify-center flex">
        <div class="card bg-slate-700 bg-opacity-50 rounded drop-shadow-xl border-slate-600 border">
            <h1>Connected!</h1>

        </div>
    </main>
    <div class="flex-row mt-16" style="width: 80vw;">
        {#each $webClient.availableKeys as key}
            <div on:mousedown={() => sendKey(key)} on:mouseup={() => sendKeyUp(key)} class="inline-block cursor-pointer key mt-4 bg-slate-700 bg-opacity-50 border border-slate-600 rounded drop-shadow-md" class:font-bold={$pressedKeys[key] === true}>{key}</div>
        {/each}
    </div>
{/if}

<style>
    .card {
        padding: 3em;
        width: 400px;
        backdrop-filter: blur(5px);
    }

    .key {
        padding: 1em;
        margin-left: 0.5em;
        margin-right: 0.5em;
        backdrop-filter: blur(5px);
    }
</style>