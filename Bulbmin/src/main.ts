import "./styles.css";
import App from "./App.svelte";
import {sleep} from "./util/sleep";
import {loadSettings} from "./util/settings";


loadSettings()

const app = new App({
    target: document.getElementById("app")!,
});


export default app;
