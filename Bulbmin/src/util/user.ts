import {usePersist} from "./fetchable.svelte";

type UserColorRecord = {
    [key: string]: string
}

export const userColors = usePersist<UserColorRecord, UserColorRecord>("playerColors", {},
    (it: UserColorRecord) => it,
    (it: UserColorRecord) => it
)