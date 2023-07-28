import {serializingStoredFetchable} from "./fetchable";
import type {Pressable} from "./input";
import {v4 as uuid} from 'uuid';
import {ALL_PRESSABLES} from "./input";

type PresetData = {
    name: string,
    keys: Pressable[],
    id: string,
    removable: boolean
}

type PresetsData = {
    data: PresetData[]
}

export class Presets {

    private readonly _data : PresetData[]

    public get data() : readonly PresetData[] { return this._data }

    public constructor(presets: PresetData[] = []) {
        this._data = presets
    }

    public createPreset(name: string) : string {
        let id = uuid()
        this._data.push({name, id, keys: [], removable: true})
        this.update()
        return id
    }

    public getPreset(id: string) : PresetData | undefined {

        return this._data.find(it => it.id == id)
    }

    public deletePreset(id: string) {
        let preset = this._data.findIndex(it => it.id == id)
        if (preset == -1) return
        this._data.splice(preset, 1)
        this.update()
    }

    public update() {
        presets.update((it) => it)
    }
}


const serialize = (presets: Presets): PresetsData => {
    return {
        data: [...presets.data]
    }
}

const deserialize = (data: PresetsData) : Presets => {
    let presets = new Presets(data.data)
    return presets
}



const defaultPresets = new Presets([
    {
        name: "everything-danger",
        keys: ALL_PRESSABLES,
        id: uuid(),
        removable: false
    },
    {
        name: "wasd-movement",
        keys: ["w", "a", "s", "d"],
        id: uuid(),
        removable: false
    },
    {
        name: "arrow-keys",
        keys: ["UpArrow", "LeftArrow", "DownArrow", "RightArrow"],
        id: uuid(),
        removable: false
    },
    {
        name: "mouse-buttons",
        keys: ["Left", "Right", "Middle"],
        id: uuid(),
        removable: false
    },
    {
        name: "numbers",
        keys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        id: uuid(),
        removable: false
    },
    {
        name: "letters",
        keys: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
        id: uuid(),
        removable: false
    },
])

export let presets = serializingStoredFetchable<Presets, PresetsData>("presets_data", defaultPresets, serialize, deserialize)