import "./styles.css";
import App from "./App.svelte";
import {loadSettings} from "./util/settings";
import {client} from "./util/connection.svelte";
import * as globalShortcut from "@tauri-apps/plugin-global-shortcut"
import {mount} from "svelte";
import {getCurrentWindow} from "@tauri-apps/api/window";
import {startKeyboardWindow} from "./keyboardWindow/main.svelte";
import {getCurrentWebviewWindow, WebviewWindow} from "@tauri-apps/api/webviewWindow";

export let keyboardWindow: WebviewWindow = undefined!

if (getCurrentWindow().label === "keyboard") {
    console.log("Keyboard window")
    keyboardWindow = getCurrentWebviewWindow()
    startKeyboardWindow()
} else {

    keyboardWindow = new WebviewWindow('keyboard', {
        url: 'index.html',
        visible: false,
        title: "Keyboard",
        closable: false,
    })

    keyboardWindow.once('tauri://created', function () {
        console.log("Keyboard window created")
    });
    keyboardWindow.once('tauri://error', function (e) {
        console.log("Keyboard window error", e)
    });

    void getCurrentWindow().emitTo("keyboard", "init", {})

    loadSettings()

    const tryUnregister = (shortcut: string) => {
        globalShortcut.unregister(shortcut)
            .catch(() => {
                console.log("Failed to unregister " + shortcut)
            })
    }

    const tryRegister = (shortcut: string, callback: () => void) => {
        globalShortcut.register(shortcut, callback)
            .catch(() => {
                console.log("Failed to register " + shortcut)
            })
    }

    tryUnregister("CmdOrControl+F12")
    tryUnregister("Alt+F12")


    tryRegister("Alt+F12", () => {
        console.log("Disconnect")
        client.$?.ws.close(1000, "Closed forcefully")
    })


    tryRegister("CmdOrControl+F12", () => {
        console.log("Pause")
        if (client.$) client.$.paused = !client.$.paused
    })



    mount(App, {
        target: document.getElementById("app")!,
    });
}