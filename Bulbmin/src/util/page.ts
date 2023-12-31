import {fetchable} from "./fetchable";
import type {SvelteComponent} from "svelte";
import SettingsComponent from "../lib/Settings.svelte";
import InvalidPage from "../lib/InvalidPage.svelte";
import PlayersPage from "../lib/PlayersPage.svelte";
import PresetsPage from "../lib/PresetsPage.svelte";


export type PageName = "settings" | "modes" | "advanced" | "players" | "presets"

export const page = fetchable<{name: PageName, component: typeof SvelteComponent}>({
    name: "settings",
    component: SettingsComponent
})

export const setPageFromName = (name: PageName) => page.set({name, component: getPageComponentFromName(name)})

export const getPageComponentFromName = (name: PageName) : typeof SvelteComponent => {
    switch (name) {
        case "settings":
            return SettingsComponent;
        case "modes":
            return InvalidPage;
        case "advanced":
            return InvalidPage;
        case "players":
            return PlayersPage;
        case "presets":
            return PresetsPage;
        default:
            return InvalidPage;
    }
}