import {invoke} from "@tauri-apps/api/core";


export type Key =
    "a" |
    "b" |
    "c" |
    "d" |
    "e" |
    "f" |
    "g" |
    "h" |
    "i" |
    "j" |
    "k" |
    "l" |
    "m" |
    "n" |
    "o" |
    "p" |
    "q" |
    "r" |
    "s" |
    "t" |
    "u" |
    "v" |
    "w" |
    "x" |
    "y" |
    "z" |
    "1" |
    "2" |
    "3" |
    "4" |
    "5" |
    "6" |
    "7" |
    "8" |
    "9" |
    "0" |
    "LeftShift" |
    "RightShift" |
    "LeftCtrl" |
    "RightCtrl" |
    "Alt" |
    "Escape" |
    "Tab" |
    "Backspace" |
    "Enter" |
    "LeftArrow" |
    "RightArrow" |
    "UpArrow" |
    "DownArrow" |
    "Meta" |
    "Space" |
    "Dot" |
    "Pause" |
    "Insert"

export type MouseButton =
    "Left" |
    "Right" |
    "Middle" |
    "ScrollUp" |
    "ScrollDown" |
    "ScrollLeft" |
    "ScrollRight"

export type Pressable = MouseButton | Key


export const ALL_PRESSABLES : Pressable[] =
    [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
        "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
        "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "0", "LeftShift", "RightShift", "LeftCtrl", "RightCtrl",
        "Alt", "Escape", "Tab", "Backspace", "Enter", "LeftArrow", "RightArrow",
        "UpArrow", "DownArrow", "Meta", "Left", "Right", "Middle", "ScrollUp",
        "ScrollDown", "ScrollLeft", "ScrollRight", "Space", "Dot", "Pause", "Insert"
    ]

export namespace Input {
    export const press = async (pressable: Pressable, releaseInMs?: number) => {
        await invoke("press_button", {"button": pressable})

        if (releaseInMs) {
            setTimeout(() => release(pressable), releaseInMs)
        }
    }

    export const click = async (pressable: Pressable) => {
        await invoke("press_button", {"button": pressable})

        setTimeout(() => release(pressable), 10)
    }

    export const release = async (pressable: Pressable) => {
        await invoke("release_button", {"button": pressable})
    }
}