<script lang="ts">
    import {webClient} from "bulbmin-web/src/connection";
    import {Client, client, type ConnectedUser} from "../util/connection";
    import type {Pressable} from "../util/input";
    import TagsInput from "./TagsInput.svelte";
    import {ALL_PRESSABLES} from "../util/input";
    import Player from "./Player.svelte";


    const connect = () => {
        if (!$client) $client = new Client()
    }
</script>

<h1 class="mb-10">Players</h1>

{#if $client === undefined}
    <h3>You're not connected!</h3>
    <button class="styled" style="margin-top: 1em" on:click={connect}>Connect</button>
{:else}
    <h3 class="mb-2">Pending Users</h3>
    {#each $client.connectedUsers.filter(it => !it.authenticated) as user (user.username)}
        <div class="mt-4 mb-1 pl-6 pr-2 p-1 bg-leaf-600 border rounded border-leaf-500 drop-shadow flex items-center justify-between">
            <p class="text-lg">{user.username}</p>
            <div>
                <button class="styled" on:click={() => $client.accept(user)}>Accept</button>
                <button class="red" on:click={() => $client.deny(user)}>Deny</button>
            </div>
        </div>
    {:else}
        <p class="ml-2">No users pending!</p>
    {/each}

    <h3 class="mt-12 mb-2">Connected Users</h3>
    {#each $client.connectedUsers.filter(it => it.authenticated) as user (user.username)}
        <Player user={user}></Player>
    {:else}
        <p class="ml-2">No users connected!</p>
    {/each}

    <h3 class="mt-12 mb-2">Global Keybinds</h3>
    <p class="text-gray-400 text-sm ml-2">Use Alt+Del to immediately stop the session.</p>
    <p class="text-gray-400 text-sm ml-2">Use Ctrl+Del to pause button inputs until you press the keybind again</p>
{/if}