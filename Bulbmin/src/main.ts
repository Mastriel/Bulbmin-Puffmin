import "./styles.css";
import App from "./App.svelte";
import {loadSettings} from "./util/settings";
import {client} from "./util/connection";
import * as globalShortcut from "@tauri-apps/plugin-global-shortcut"


loadSettings()


await globalShortcut.unregister("CmdOrControl+F12")
await globalShortcut.unregister("Alt+F12")

await globalShortcut.register("Alt+F12", () => {
    console.log("Disconnect")
    client.get()?.ws.close(1000, "Closed forcefully")
})


await globalShortcut.register("CmdOrControl+F12", () => {
    console.log("Pause")
    let c = client?.get()
    if (c) c.paused = !c.paused
})

const app = new App({
    target: document.getElementById("app")!,
});




export default app;
