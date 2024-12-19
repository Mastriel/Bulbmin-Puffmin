import type {Key, Pressable} from "bulbmin/src/util/input";
import {webClient} from "./connection";
import type {FromWebUserKeyPress, FromWebUserKeyUnpress} from "communication/src/connections";
import {type Fetchable, fetchable} from "./fetchable";


export const pressedKeys = fetchable<PressedKeyMask>({})


export const sendKey = (key: Key) => {
    if (!webClient.get().availableKeys.includes(key)) return
    if (pressedKeys.get()[key]) return
    webClient.get().ws.send(JSON.stringify(<FromWebUserKeyPress>{
        key: key,
        type: "user_keypress"
    }))
    pressedKeys.update((it) => {
        it[key] = true
        return it
    })
}
export const sendKeyUp = (key: Key) => {
    if (!webClient.get().availableKeys.includes(key)) return
    webClient.get().ws.send(JSON.stringify(<FromWebUserKeyUnpress>{
        key: key,
        type: "user_keyunpress"
    }))
    pressedKeys.update((it) => {
        it[key] = false
        return it
    })
}

window.addEventListener("keydown", (ev) => {
    if (!webClient.get()) return;

    ev.preventDefault()


    let key = convertNormalKey(ev.key)
    if (key && !pressedKeys.get()[key]) {
        sendKey(key)
        return
    }
    key = convertKeyCode(ev.code)
    if (!pressedKeys.get()[key]) sendKey(key)
})

window.addEventListener("keyup", (ev) => {
    if (!webClient.get()) return;


    let key = convertNormalKey(ev.key)
    if (key) {
        sendKeyUp(key)
        return
    }
    key = convertKeyCode(ev.code)
    sendKeyUp(key)
})

type PressedKeyMask = {
    [K in Key]?: boolean
}



export const convertKeyCode = (str: string) : Key => {
    switch (str) {
        case "ShiftLeft":
            return "LeftShift"
        case "ShiftRight":
            return "RightShift"
        case "ControlLeft":
            return "LeftCtrl"
        case "ControlRight":
            return "RightCtrl"
        case "AltLeft":
        case "AltRight":
            return "Alt"
        case "Escape":
            return "Escape"
        case "Tab":
            return "Tab"
        case "Backspace":
            return "Backspace"
        case "Enter":
            return "Enter"
        case "ArrowLeft":
            return "LeftArrow"
        case "ArrowRight":
            return "RightArrow"
        case "ArrowUp":
            return "UpArrow"
        case "ArrowDown":
            return "DownArrow"
        case "MetaLeft":
        case "MetaRight":
            return "Meta"
        case "Space":
            return "Space"
        case "Period":
            return "Dot"
    }
}

export const convertNormalKey = (str: string) : Key => {
    switch (str.toLowerCase() as Key) {
        case "a":
        case "b":
        case "c":
        case "d":
        case "e":
        case "f":
        case "g":
        case "h":
        case "i":
        case "j":
        case "k":
        case "l":
        case "m":
        case "n":
        case "o":
        case "p":
        case "q":
        case "r":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
            return str as Key
    }
    return undefined
}