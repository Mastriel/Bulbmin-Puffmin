<script lang="ts">

    import {ALL_PRESSABLES, type Pressable} from "../util/input";
    import TagsInput from "./TagsInput.svelte";
    import {presets} from "../util/presets.svelte";
    import Card from "./Card.svelte";
    import {toaster} from "../util/toast.svelte";

    const {
        id
    } : {
        id: string
    } = $props()

    const preset = $derived(presets.$.getPreset(id)!)


    let values = $derived(preset.keys)


    const valuesChange = (values: string[]) => {
        preset.keys = values as Pressable[]
    }

    const copyKeys = () => {
        navigator.clipboard.writeText(values.join(","))
        toaster.$.push({body: `Copied keys for Preset:${presets.$.getPreset(id)!.name}`})
    }

    const remove = () => {
        presets.$.deletePreset(id)
    }

</script>

<Card>
    <p class="text-lg mb-1">Preset:{preset.name}</p>
    <TagsInput immutable={!preset.removable} options={ALL_PRESSABLES} bind:values={values} valuesChange={valuesChange} className="bg-leaf-800 border-leaf-600 border rounded outline-0 p-1.5"/>
    {#if preset.removable}
        <button class="styled float-left" style="margin-left: 0" onclick={() => values = []}>Clear Buttons</button>
    {/if}
    <button class="styled" style="margin-left: 0" onclick={copyKeys}>Copy</button>
    {#if preset.removable}
        <button class="red float-right" style="margin-right: 0" onclick={remove}>Remove</button>
    {/if}
</Card>