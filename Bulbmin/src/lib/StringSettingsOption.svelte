<script lang="ts">
    import type {Setting} from "../util/settings";
    import {getSettingValue, PendingSettings} from "../util/settings";

    export let setting : Setting

    $: value = getSettingValue(setting) ?? setting.defaultValue

    let pendingValue : string


    const change = (ev: Event) => {
        PendingSettings[setting.id] = (ev.target as HTMLInputElement).value
    }
</script>

<p>{setting.name}</p>
<input type="text" value={value} class="bg-gray-600 pl-2 pr-2 rounded w-1/2" on:change={change}>
