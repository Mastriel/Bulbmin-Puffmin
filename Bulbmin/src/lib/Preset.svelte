<script lang="ts">

    import {ALL_PRESSABLES, type Pressable} from "../util/input";
    import TagsInput from "./TagsInput.svelte";
    import {presets} from "../util/presets";
    import Card from "./Card.svelte";
    import {toaster} from "../util/toast";

    export let id : string

    $: preset = $presets.getPreset(id)


    let values = $presets.getPreset(id)!.keys


    const valuesChange = (values: string[]) => {
        let keys = $presets.getPreset(id)?.keys
        if (keys) keys = values as Pressable[]
        $presets.update()
    }

    const copyKeys = () => {
        navigator.clipboard.writeText(values.join(","))
        toaster.push({body: `Copied keys for Preset:${$presets.getPreset(id)!.name}`})
    }

    const remove = () => {
        $presets.deletePreset(id)
    }


</script>

<Card>
    <p class="text-lg mb-1">Preset:{preset.name}</p>
    <TagsInput immutable={!preset.removable} options={ALL_PRESSABLES} bind:values={values} valuesChange={valuesChange} className="bg-leaf-800 border-leaf-600 border rounded outline-0 p-1.5"/>
    {#if preset.removable}
        <button class="styled float-left" style="margin-left: 0" on:click={() => values = []}>Clear Buttons</button>
    {/if}
    <button class="styled" style="margin-left: 0" on:click={copyKeys}>Copy</button>
    {#if preset.removable}
        <button class="red float-right" style="margin-right: 0" on:click={remove}>Remove</button>
    {/if}
</Card>