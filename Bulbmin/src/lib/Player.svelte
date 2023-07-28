<script lang="ts">
    import {ALL_PRESSABLES, type Pressable} from "../util/input";
    import {client, type ConnectedUser} from "../util/connection";
    import TagsInput from "./TagsInput.svelte";
    import {onMount} from "svelte";
    import Card from "./Card.svelte";
    import {presets} from "../util/presets";
    import {toaster} from "../util/toast";

    export let user : ConnectedUser

    let values : string[] = user.availableKeys

    const setKeysFor = (user: ConnectedUser, keys: string[]) => {
        $client?.setAvailableKeys(user, keys as Pressable[])
        values = keys
    }

    const formatKeys = (set: Set<Pressable>) => {
        return Array.from(set.keys()).join(", ")
    }

    const valuesChanged = (keys: string[], user: ConnectedUser) => {
        setKeysFor(user, keys)
    }

    const copyKeys = () => {
        navigator.clipboard.writeText(values.join(","))
        toaster.push({body: `Copied keys for ${user.username}`})

    }

    const transformer = (value: string) : string[] | undefined => {
        if (value.startsWith("Preset:")) {
            let name = value.split("Preset:")[1]
            console.log(name)
            return $presets.data.find(it => it.name == name)!.keys
        }
        return undefined
    }

    let options = [...ALL_PRESSABLES, ...$presets.data.map(it => "Preset:" + it.name)]
</script>

<Card>
    <p class="float-right">{formatKeys(user.keysHeld)}</p>
    <p class="text-lg mb-1">{user.username}</p>
    <TagsInput transformer={transformer} options={options} valuesChange={(keys) => valuesChanged(keys, user)} bind:values={values} className="bg-leaf-800 border-leaf-600 border rounded outline-0 p-1.5"></TagsInput>
    <button class="styled float-left" style="margin-left: 0" on:click={() => setKeysFor(user, [])}>Clear Buttons</button>
    <button class="styled" style="margin-left: 0" on:click={copyKeys}>Copy</button>

    <button class="red float-right" style="margin-right: 0" on:click={() => $client.kick(user)}>Kick</button>
</Card>