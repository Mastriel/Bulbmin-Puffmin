import {mount} from "svelte";
import KeyboardApp from "./KeyboardApp.svelte";
import type {Pressable} from "../util/input";
import {getCurrentWebviewWindow} from "@tauri-apps/api/webviewWindow";

export type KeyboardUser = {
    username: string,
    color: string,
    keysHeld: Pressable[]
}


type KeyboardAppProps = {
    users: KeyboardUser[]
}

export function startKeyboardWindow() {

    const props : KeyboardAppProps = $state({
        users: []
    })

    void getCurrentWebviewWindow().listen("state-change", (event) => {
        const data = event.payload as KeyboardAppProps
        props.users = data.users
    })

    mount(KeyboardApp, {
        target: document.getElementById('app')!,
        props
    })
}