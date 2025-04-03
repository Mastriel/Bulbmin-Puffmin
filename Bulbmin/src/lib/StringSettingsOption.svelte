<script lang="ts">
    import type {Setting} from "../util/settings";
    import {getSettingValue, PendingSettings} from "../util/settings";

    const {setting} : {setting:Setting} = $props()

    const value = $derived(getSettingValue(setting) ?? setting.defaultValue)

    const change = (ev: Event) => {
        PendingSettings[setting.id] = (ev.target as HTMLInputElement).value
    }
</script>

<p class="mt-4">{setting.name}</p>
<input type="text" value={value} class="styled w-96 max-w-1/2" onchange={change}>