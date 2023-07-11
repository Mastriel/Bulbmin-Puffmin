<script lang="ts">
    import {page, type PageName, setPageFromName} from "./util/page";
    import {client, Client, connectionError} from "./util/connection";
    import {cli, notification} from "@tauri-apps/api";

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
            displayName: "Modes",
            name: "modes"
        },
        {
            displayName: "Players",
            name: "players"
        },
        {
            displayName: "Advanced",
            name: "advanced"
        },
    ]

    connectionError.subscribe((it) => {
        if (it) notification.sendNotification({title: "Bulbmin", body: it!})
        console.log("wah!")
    })

    const connect = () => {
        if (!$client) $client = new Client()
    }
</script>


<div class="flex w-full h-screen flex-row">
    <div class="w-40">
        <h2 class="text-center mt-4">Bulbmin</h2>
        <button class="text-center styled" on:click={connect} style="width:90%; margin-top: 1em">Connect</button>
        <div class="flex items-center h-3/4">
            <div>
                {#each pages as iPage}
                    <a class="block pl-4 mt-2 mb-2 option cursor-pointer" on:click={()=>selectPage(iPage.name)} class:selected={$page.name === iPage.name}>{iPage.displayName}</a>
                {/each}
            </div>
        </div>
    </div>
    <div class="items-center line h-full" style="width: 1px">
    </div>
    <main class="h-full w-full p-4">
        <svelte:component this={$page.component}/>
    </main>
</div>


<style>
    .line {
        background: linear-gradient(0deg, #fff4 0%, white 50%, #fff4 100%);
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
</style>