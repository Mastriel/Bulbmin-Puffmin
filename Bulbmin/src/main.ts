import "./styles.css";
import App from "./App.svelte";
import {loadSettings} from "./util/settings";
import {client} from "./util/connection";
import * as globalShortcut from "@tauri-apps/plugin-global-shortcut"


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
    client.get()?.ws.close(1000, "Closed forcefully")
})


tryRegister("CmdOrControl+F12", () => {
    console.log("Pause")
    let c = client?.get()
    if (c) c.paused = !c.paused
})

const app = new App({
    target: document.getElementById("app")!,
});




export default app;
