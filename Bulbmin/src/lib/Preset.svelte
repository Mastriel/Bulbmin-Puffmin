<script lang="ts">

    import {ALL_PRESSABLES, type Pressable} from "../util/input";
    import TagsInput from "./TagsInput.svelte";
    import {presets} from "../util/presets";
    import Card from "./Card.svelte";

    export let id : string

    let values = $presets.getPreset(id)!.keys

    const valuesChange = (values: string[]) => {
        let keys = $presets.getPreset(id)?.keys
        if (keys) keys = values as Pressable[]
        $presets.update()
    }

    const copyKeys = () => {
        navigator.clipboard.writeText(values.join(","))
    }

    const remove = () => {
        $presets.deletePreset(id)
    }

</script>

<Card>
    <p class="text-lg mb-1">Preset:{$presets.getPreset(id).name}</p>
    <TagsInput options={ALL_PRESSABLES} bind:values={values} valuesChange={valuesChange} className="bg-leaf-800 border-leaf-600 border rounded outline-0 p-1"/>
    <button class="styled float-left" style="margin-left: 0" on:click={() => values = []}>Clear Buttons</button>
    <button class="styled" style="margin-left: 0" on:click={copyKeys}>Copy</button>
    <button class="red float-right" style="margin-right: 0" on:click={remove}>Remove</button>
</Card>