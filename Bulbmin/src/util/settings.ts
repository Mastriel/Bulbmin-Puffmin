

export type SettingType = "string"

export type Setting = {
    type: SettingType,
    name: string,
    id: string,
    defaultValue: string
    validator: (input: string) => string[]
}

export let AppSettings : SerializedSettings
export let PendingSettings : SerializedSettings

export const AVAILABLE_SETTINGS : Setting[] = [
    {
        type: "string",
        name: "Server Address (only use servers you trust!)",
        id: "server-address",
        defaultValue: "wss://puffmin.calathea.dev/web/connect",
        validator: input => []
    },
    {
        type: "string",
        name: "Client Name",
        id: "room-name",
        defaultValue: "My room",
        validator: input => []
    },
    {
        type: "string",
        name: "Password",
        id: "password",
        defaultValue: "password",
        validator: input => []
    },
]

export const getSettingValue = <T>(key: Setting) : T => {
    return AppSettings[key.id]
}

const BULBMIN_SETTINGS_KEY = "bulbmin-settings"

export type SerializedSettings = {
    [k: string]: any
}

export const generateDefaultSettings = (settings: SerializedSettings = {}): SerializedSettings => {
    for (let setting of AVAILABLE_SETTINGS) {
        if (!settings[setting.id]) settings[setting.id] = setting.defaultValue
    }
    return settings
}

export const loadSettings = () => {
    let settingsString = localStorage.getItem(BULBMIN_SETTINGS_KEY)
    if (!settingsString) {
        AppSettings = generateDefaultSettings()
        PendingSettings = AppSettings
        return
    }

    let parsed : SerializedSettings
    try {
        parsed = <SerializedSettings> JSON.parse(settingsString)
    } catch (e) {
        AppSettings = generateDefaultSettings()
        PendingSettings = AppSettings
        return
    }

    AppSettings = generateDefaultSettings(parsed);
    PendingSettings = AppSettings
}