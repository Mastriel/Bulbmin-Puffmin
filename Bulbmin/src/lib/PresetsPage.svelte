<script lang="ts">
    import TagsInput from "./TagsInput.svelte";
    import {ALL_PRESSABLES} from "../util/input";
    import {presets} from "../util/presets";
    import Preset from "./Preset.svelte";


    let inputValue : string = ""
    const input = (ev: InputEvent) => {
        let element = (ev.target as HTMLInputElement)

        element.value = element.value.toLowerCase()
            .replace(" ", "-")
            .replace(/[^a-z0-9\-]*/g, "");
    }

    const createPreset = () => {
        if (inputValue == "") return
        if ($presets.data.find(it => it.name == inputValue)) return
        console.log("wah!")
        $presets.createPreset(inputValue)
        inputValue = ""
    }
</script>

<h1>Presets</h1>

<p class="text-gray-400 text-sm ml-2 mt-5">Presets allow you to define sets of keys that players can use. Presets appear at the bottom of the drop-down menu that appears when adding keys to a player.</p>

<input type="text" maxlength="20" placeholder="Preset Name" class="styled mt-5" on:input={input} on:keypress={(ev) => ev.key === "Enter" ? createPreset() : undefined} bind:value={inputValue}>
<button class="styled" on:click={createPreset}>Create Preset</button>


{#each $presets.data.toReversed() as preset (preset.id)}
    <Preset id={preset.id}/>
{/each}
