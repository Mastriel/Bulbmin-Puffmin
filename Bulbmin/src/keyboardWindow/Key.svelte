<script lang="ts" generics="T extends boolean = false">

    import type {Pressable} from "../util/input";
    import type {KeyboardUser} from "./main.svelte";

    const {
        key,
        users,
        flex = 1,
        fake,
        label = key,
        class: classes = ""
    } : {
        key: T extends false ? Pressable : string,
        users: KeyboardUser[],
        flex?: number,
        fake?: T,
        label?: string,
        class?: string
    } = $props()

    const color: string = $derived.by(() => {
        const pressedUsers = users.filter(user => user.keysHeld.includes(key as Pressable))

        if (pressedUsers.length == 0) {
            return 'transparent'
        }

        return pressedUsers[0].color
    })
</script>


<div class="p-4 py-2 h-16 text-center bg-leaf-800 border-leaf-550 border rounded-md flex justify-center items-center press-shadow {classes}"
     style:flex-grow={flex}
     style:--color={color}
>
    {label}
</div>

<style>
    .press-shadow {
        box-shadow: 0 0 10px 1px var(--color);
        transition: box-shadow 0.1s ease-in-out;
        outline-color: var(--color) !important;
        outline-width: 1px;
        outline-style: solid;
        outline-offset: -1px;
    }

    .press-shadow:hover {
        box-shadow: 0 0 10px 1px #fff;
        transition: box-shadow 0.1s ease-in-out;
        outline-color: #fff !important;
        outline-width: 1px;
        outline-style: solid;
        outline-offset: -1px;
    }
</style>

