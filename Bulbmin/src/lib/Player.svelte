<script lang="ts">
    import {ALL_PRESSABLES, type Pressable} from "../util/input";
    import {client, type ConnectedUser} from "../util/connection.svelte";
    import TagsInput from "./TagsInput.svelte";
    import Card from "./Card.svelte";
    import {presets} from "../util/presets.svelte";
    import {toaster} from "../util/toast.svelte";
    import {notNull, usePersist} from "../util/fetchable.svelte";
    import {userColors} from "../util/user.js";

    const {
        user
    } : {
        user: ConnectedUser
    } = $props()

    let values : string[] = $state(user.availableKeys)

    const setKeysFor = (user: ConnectedUser, keys: string[]) => {
        client.$?.setAvailableKeys(user, keys as Pressable[])
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
        toaster.$.push({body: `Copied keys for ${user.username}`})

    }

    const transformer = (value: string) : string[] | undefined => {
        if (value.startsWith("Preset:")) {
            let name = value.split("Preset:")[1]
            console.log(name)
            return presets.$.data.find(it => it.name == name)!.keys
        }
        return undefined
    }

    const getColor = () => {
        return userColors.$[user.username] ?? "#ffffff"
    }

    const setColor = (value: string) => {
        userColors.$[user.username] = value
        console.log(value)
    }

    let options = [...ALL_PRESSABLES, ...presets.$.data.map(it => "Preset:" + it.name)]
</script>

<Card class="flex flex-col gap-1">
    <div class="flex justify-between w-full">
        <p class="text-lg mb-1">{user.username}</p>
        <div class="flex justify-end items-center gap-4">
            <span>{formatKeys(user.keysHeld)}</span>
            <div class="border border-leaf-450 p-0.5 rounded-sm mr-1 flex justify-center">
                <input type="color" bind:value={getColor, setColor} class="w-4 h-4 rounded-sm bg-transparent">
            </div>
        </div>
    </div>

    <TagsInput transformer={transformer} options={options} valuesChange={(keys) => valuesChanged(keys, user)} bind:values={values} className="bg-leaf-800 border-leaf-600 border rounded outline-0 p-1.5"></TagsInput>
    <div class="flex justify-between">
        <div>
            <button class="styled" style="margin-left: 0" onclick={() => setKeysFor(user, [])}>Clear Buttons</button>
            <button class="styled" style="margin-left: 0" onclick={copyKeys}>Copy</button>
        </div>
        <div>
            <button class="red" style="margin-right: 0" onclick={() => notNull(client.$).kick(user)}>Kick</button>
        </div>
    </div>
</Card>

<style>
    input[type="color"] {
        -webkit-appearance: none;
        appearance: none;
        border: none;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    input[type="color"]::-webkit-color-swatch {
        border: none;
    }
</style>