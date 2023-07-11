import "./styles.css";
import App from "./App.svelte";
import {sleep} from "./util/sleep";
import {loadSettings} from "./util/settings";
import {globalShortcut} from "@tauri-apps/api";
import {client} from "./util/connection";


loadSettings()

await globalShortcut.register("Alt+Delete", () => {
    console.log("Disconnect")
    client.get()?.ws.close(1000, "Closed")
})

const app = new App({
    target: document.getElementById("app")!,
});




export default app;
