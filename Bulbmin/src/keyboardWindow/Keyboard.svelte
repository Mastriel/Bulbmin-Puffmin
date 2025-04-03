<script lang="ts">
    import type {KeyboardUser} from "./main.svelte.js";
    import {ALL_PRESSABLES} from "../util/input";
    import Key from "./Key.svelte";

    const {
        users
    }: {
        users: KeyboardUser[]
    } = $props();
</script>

<div class="flex flex-col gap-2">
    <div class="flex w-[95%] gap-2 m-auto">
        <Key {users} fake key="`"></Key>
        <Key {users} key="1"></Key>
        <Key {users} key="2"></Key>
        <Key {users} key="3"></Key>
        <Key {users} key="4"></Key>
        <Key {users} key="5"></Key>
        <Key {users} key="6"></Key>
        <Key {users} key="7"></Key>
        <Key {users} key="8"></Key>
        <Key {users} key="9"></Key>
        <Key {users} key="0"></Key>
        <Key {users} fake key="-"></Key>
        <Key {users} fake key="+"></Key>
        <Key {users} key="Backspace"></Key>
    </div>

    <div class="flex w-[95%] gap-2 m-auto">
        <Key {users} flex={2.0} key="Tab"></Key>
        <Key {users} key="q"></Key>
        <Key {users} key="w"></Key>
        <Key {users} key="e"></Key>
        <Key {users} key="r"></Key>
        <Key {users} key="t"></Key>
        <Key {users} key="y"></Key>
        <Key {users} key="u"></Key>
        <Key {users} key="i"></Key>
        <Key {users} key="o"></Key>
        <Key {users} key="p"></Key>
        <Key {users} flex={1.7} fake key="["></Key>
        <Key {users} flex={1.7} fake key="]"></Key>
        <Key {users} flex={1.7} fake key="|"></Key>
    </div>

    <div class="flex w-[95%] gap-2 m-auto">
        <Key {users} flex={0.4} fake key="Caps Lock"></Key>
        <Key {users} key="a"></Key>
        <Key {users} key="s"></Key>
        <Key {users} key="d"></Key>
        <Key {users} key="f"></Key>
        <Key {users} key="g"></Key>
        <Key {users} key="h"></Key>
        <Key {users} key="j"></Key>
        <Key {users} key="k"></Key>
        <Key {users} key="l"></Key>
        <Key {users} fake key=";"></Key>
        <Key {users} fake key="'"></Key>
        <Key {users} flex={3.2} fake key="Enter"></Key>
    </div>

    <div class="flex w-[95%] gap-2 m-auto">
        <Key {users} flex={5.5} key="LeftShift" label="Shift"></Key>
        <Key {users} key="z"></Key>
        <Key {users} key="x"></Key>
        <Key {users} key="c"></Key>
        <Key {users} key="v"></Key>
        <Key {users} key="b"></Key>
        <Key {users} key="n"></Key>
        <Key {users} key="m"></Key>
        <Key {users} fake key="<"></Key>
        <Key {users} fake key=">"></Key>
        <Key {users} fake key="/"></Key>
        <Key {users} flex={6} key="RightShift" label="Shift"></Key>
    </div>

    <div class="flex w-[95%] gap-2 m-auto">
        <Key {users} key="LeftCtrl" label="Ctrl"></Key>
        <Key {users} fake key="Fn"></Key>
        <Key {users} key="Meta"></Key>
        <Key {users} key="Alt"></Key>
        <Key {users} flex={30} key="Space"></Key>
        <Key {users} fake key="<no right alt>" label="Alt"></Key>
        <Key {users} key="RightCtrl" label="Ctrl"></Key>
        <Key {users} fake key="LeftArrow" label="Left"></Key>
        <div class="flex flex-col gap-2">
            <Key {users} fake key="UpArrow" label="Up" class="!h-4"></Key>
            <Key {users} fake key="DownArrow" label="Down" class="!h-4"></Key>
        </div>
        <Key {users} fake key="RightArrow" label="Right"></Key>
    </div>
</div>
