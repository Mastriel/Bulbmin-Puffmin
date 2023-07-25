import "./styles.css";
import App from "./App.svelte";
import {sleep} from "./util/sleep";
import {loadSettings} from "./util/settings";
import {globalShortcut} from "@tauri-apps/api";
import {client} from "./util/connection";
import {invoke} from "@tauri-apps/api/tauri";


loadSettings()

await globalShortcut.unregister("CmdOrControl+Delete")
await globalShortcut.unregister("Alt+Delete")


await globalShortcut.register("Alt+Delete", () => {
    console.log("Disconnect")
    client.get()?.ws.close(1000, "Closed")
})


await globalShortcut.register("CmdOrControl+Delete", () => {
    console.log("Pause")
    let c = client?.get()
    if (c) c.paused = !c.paused
})

const app = new App({
    target: document.getElementById("app")!,
});




export default app;
