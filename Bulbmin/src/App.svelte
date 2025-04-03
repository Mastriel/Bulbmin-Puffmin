<script lang="ts">
    import {page, type PageName, setPageFromName} from "./util/page";
    import {client, Client, connectionError} from "./util/connection.svelte";
    import {toaster} from "./util/toast.svelte";
    import ToastContainer from "./lib/toasts/ToastContainer.svelte";
    import { version } from "../../package.json"
    import type {KeyboardUser} from "./keyboardWindow/main.svelte";
    import {userColors} from "./util/user";
    import {keyboardWindow} from "./main";

    const selectPage = (name: PageName) => {
        setPageFromName(name)
    }

    type Page = {
        displayName: string,
        name: PageName
    }

    const pages : Page[] = [
        {
            displayName: "Settings",
            name: "settings"
        },
        {
            displayName: "Players",
            name: "players"
        },
        {
            displayName: "Presets",
            name: "presets"
        },
        {
            displayName: "Modes",
            name: "modes"
        },
        {
            displayName: "Advanced",
            name: "advanced"
        }
    ]
    $effect(() => {
        if (connectionError.$) {
            toaster.$.push({body: connectionError.$})
        }
    })

    $effect(() => {
        if (client.$) {
            const keyboardUsers : KeyboardUser[] = client.$.connectedUsers.map(it => {
                return {
                    username: it.username,
                    color: userColors.$[it.username],
                    keysHeld: [...it.keysHeld]
                }
            })

            keyboardWindow?.emit("state-change", {
                users: keyboardUsers
            })
        }
    })


    const connect = () => {
        if (!client.$) client.$ = new Client()
    }

    const disconnect = () => {
        client.$?.close()
        client.$ = undefined
    }

    const PageComponent = $derived(page.$.component)
</script>

<ToastContainer/>

<div class="flex w-full h-screen flex-row">
    <div class="w-40">
        <div class="h-60">
            <h2 class="text-center mt-4">Bulbmin</h2>
            {#if !client.$}
                <button class="text-center styled" onclick={connect} style="width:90%; margin-top: 1em">Connect</button>
            {:else}
                <button class="text-center styled" onclick={disconnect} style="width:90%; margin-top: 1em">Disconnect</button>
            {/if}
            {#if client.$?.paused}
                <h6 class="text-center text-sm text-red-400">Paused</h6>
            {/if}
        </div>
        <div class="flex items-center absolute">
            <div>
                {#each pages as iPage}
                    <a class="block pl-4 mt-2 mb-2 option cursor-pointer" onclick={()=>selectPage(iPage.name)} class:selected={page.$.name === iPage.name}>{iPage.displayName}</a>
                {/each}
            </div>
        </div>
    </div>
    <div class="items-center line h-full" style="width: 2px">
    </div>
    <main class="h-full w-full p-4 overflow-x-hidden scroll mr-1">
        <PageComponent />
    </main>
</div>

<div class="absolute text-leaf-450 bottom-1 left-2 font-[monospace] text-sm">
    v{version}
</div>


<style>
    .line {
        background: linear-gradient(0deg, #6a8c5a44 0%, #6a8c5a 50%, #6a8c5a44 100%);
    }

    .option {
        color: gray;
        margin-left: 0;
        transition: color 100ms ease-in-out, margin-left 100ms ease-in-out;
    }

    .option.selected {
        color: white;
        margin-left: 10px;
    }

    .scroll::-webkit-scrollbar {
        width: 8px;
    }

    .scroll::-webkit-scrollbar-track {
        @apply bg-leaf-500 m-1 rounded-3xl;
    }

    .scroll::-webkit-scrollbar-thumb {
        @apply bg-leaf-450 rounded-3xl;
    }
</style>