<script lang="ts">
    import StringSettingsOption from "./StringSettingsOption.svelte";
    import {relaunch} from "@tauri-apps/plugin-process";
    import {AVAILABLE_SETTINGS, generateDefaultSettings, PendingSettings} from "../util/settings"
    import {sleep} from "../util/sleep";
    import {keyboardWindow} from "../main";

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

    const toggleKeyboardWindow = async () => {
        if (await keyboardWindow.isVisible()) {
            await keyboardWindow.hide()
        } else {
            await keyboardWindow.show()
        }
    }
</script>


<h1 class="mb-10">Settings</h1>

{#each AVAILABLE_SETTINGS as setting}
    {#if setting.type === "string"}
        <StringSettingsOption setting={setting}/>
    {/if}
{/each}

<br><br>
<div class="flex gap-2">
    <button class="styled !m-0" onclick={save}>Save</button>
    <button class="red !m-0" onclick={reset}>Reset</button>
    <span class="text-gray-400 text-sm">Saving/resetting will restart the application.</span>
</div>

<button class="styled !ml-0 mt-1" onclick={toggleKeyboardWindow}>Toggle keyboard window</button>
