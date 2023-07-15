<script lang="ts">
    import {ALL_PRESSABLES, type Pressable} from "../util/input";
    import {client, type ConnectedUser} from "../util/connection";
    import TagsInput from "./TagsInput.svelte";

    export let user : ConnectedUser

    let values : string[]

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
    }
</script>

<div class="mt-4 mb-1 p-3 border-slate-600 border bg-slate-700 rounded">
    <p class="float-right">{formatKeys(user.keysHeld)}</p>
    <p class="text-lg">{user.username}</p>
    <TagsInput options={ALL_PRESSABLES} valuesChange={(keys) => valuesChanged(keys, user)} bind:values={values} className="bg-slate-800 border-slate-600 border rounded outline-0 p-1"></TagsInput>
    <button class="styled float-left" style="margin-left: 0" on:click={() => setKeysFor(user, [])}>Clear Buttons</button>
    <button class="styled" style="margin-left: 0" on:click={copyKeys}>Copy</button>

    <button class="red float-right" style="margin-right: 0" on:click={() => $client.kick(user)}>Kick</button>
</div>