<script lang="ts">
    import {webClient} from "bulbmin-web/src/connection";
    import {client, type ConnectedUser} from "../util/connection";
    import type {Pressable} from "../util/input";
    import TagsInput from "./TagsInput.svelte";
    import {ALL_PRESSABLES} from "../util/input";
    import Player from "./Player.svelte";


</script>

<h1 class="mb-10">Players</h1>

{#if $client === undefined}
    <h3>You're not connected, dipshit!</h3>
{:else}
    <h3>Pending Users</h3>
    {#each $client.connectedUsers.filter(it => !it.authenticated) as user}
        <div class="mt-4 mb-1 pl-6 border-t border-slate-600">
            <p>{user.username}
                <span class="cursor-pointer" on:click={() => $client.accept(user)}>✅</span>
                <span class="cursor-pointer" on:click={() => $client.deny(user)}>❌</span>
            </p>
        </div>
    {:else}
        <p>No users pending!</p>
    {/each}

    <h3 class="mt-12">Connected Users</h3>
    {#each $client.connectedUsers.filter(it => it.authenticated) as user}
        <Player user={user}></Player>
    {:else}
        <p>No users connected!</p>
    {/each}

    <h3 class="mt-12 mb-2">Global Keybinds</h3>
    <p class="text-gray-400 text-sm ml-2">Use Alt+Del to immediately stop the session.</p>
    <p class="text-gray-400 text-sm ml-2">Use Ctrl+Del to pause button inputs until you press the keybind again</p>
{/if}