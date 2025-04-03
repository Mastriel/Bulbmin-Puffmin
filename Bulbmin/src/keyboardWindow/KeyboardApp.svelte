<script lang="ts">
    import Key from "./Key.svelte";
    import type {KeyboardUser} from "./main.svelte";
    import {ALL_PRESSABLES} from "../util/input";
    import Keyboard from "./Keyboard.svelte";

    const {
        users
    }: {
        users: KeyboardUser[]
    } = $props();
</script>

<div class="w-full h-screen flex items-center bg-black bg-opacity-50">
    <div class="w-full">
        <Keyboard {users}/>

    </div>
</div>

<style>

</style>