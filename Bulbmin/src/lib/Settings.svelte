<script lang="ts">
    import StringSettingsOption from "./StringSettingsOption.svelte";
    import {relaunch} from "@tauri-apps/plugin-process";
    import {AVAILABLE_SETTINGS, generateDefaultSettings, PendingSettings} from "../util/settings"
    import {sleep} from "../util/sleep";

    let savedText : HTMLSpanElement



    const save = async () => {
        localStorage.setItem("bulbmin-settings", JSON.stringify(PendingSettings))
        console.log(PendingSettings)
        await sleep(500);
        await relaunch();
    }

    const reset = async () => {
        localStorage.setItem("bulbmin-settings", JSON.stringify(generateDefaultSettings()))
        await sleep(500);
        await relaunch();
    }
</script>


<h1 class="mb-10">Settings</h1>

{#each AVAILABLE_SETTINGS as setting}
    {#if setting.type === "string"}
        <StringSettingsOption setting={setting}/>
    {/if}
{/each}

<br><br>
<button class="styled" on:click={save}>Save</button>
<button class="red" on:click={reset}>Reset</button>
<span class="text-gray-400 text-sm">Saving/resetting will restart the application.</span>