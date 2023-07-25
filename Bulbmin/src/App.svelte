<script lang="ts">
    import {page, type PageName, setPageFromName} from "./util/page";
    import {client, Client, connectionError} from "./util/connection";
    import {cli, notification} from "@tauri-apps/api";
    import {toast} from "./util/toast";
    import ToastContainer from "./lib/toasts/ToastContainer.svelte";

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

    connectionError.subscribe((it) => {
        if (it) toast.push({body: it})
        console.log("wah!")
    })

    const connect = () => {
        if (!$client) $client = new Client()
    }

    const disconnect = () => {
        $client?.close()
        $client = undefined
    }
</script>

<ToastContainer/>

<div class="flex w-full h-screen flex-row">
    <div class="w-40">
        <div class="h-60">
            <h2 class="text-center mt-4">Bulbmin</h2>
            {#if !$client}
                <button class="text-center styled" on:click={connect} style="width:90%; margin-top: 1em">Connect</button>
            {:else}
                <button class="text-center styled" on:click={disconnect} style="width:90%; margin-top: 1em">Disconnect</button>
            {/if}
            {#if $client?.paused}
                <h6 class="text-center text-sm text-red-400">Paused</h6>
            {/if}
        </div>
        <div class="flex items-center relative">
            <div>
                {#each pages as iPage}
                    <a class="block pl-4 mt-2 mb-2 option cursor-pointer" on:click={()=>selectPage(iPage.name)} class:selected={$page.name === iPage.name}>{iPage.displayName}</a>
                {/each}
            </div>
        </div>
    </div>
    <div class="items-center line h-full" style="width: 2px">
    </div>
    <main class="h-full w-full p-4 overflow-x-hidden scroll mr-1">
        <svelte:component this={$page.component}/>
    </main>
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