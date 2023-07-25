import type {Updater, Writable} from "svelte/store";
import {writable} from "svelte/store";


/**
 * A writable with an additional get method, to retrieve values easily.
 * When the Fetchable updates, any data obtained from get is obsolete.
 *
 * @see Writable
 */
export interface Fetchable<T> extends Writable<T> {
    get: () => T | undefined
}

/**
 * Creates a new Fetchable.
 *
 * @param value The initial value of this Fetchable
 * @see Fetchable
 */
export function fetchable<T>(value: T | undefined = undefined): Fetchable<T> {
    let store = writable<T>(value)

    let fetchable = {
        cachedValue: <T | undefined> value,
        set(value: T) {
            fetchable.cachedValue = value
            store.set(value)
        },
        subscribe: store.subscribe,
        update(updater: Updater<T>) {
            let updatedValue = updater(fetchable.cachedValue!)
            fetchable.cachedValue = updatedValue
            store.set(updatedValue)
        },
        get: () => {
            return fetchable.cachedValue
        }
    }
    return fetchable
}


/**
 * Creates a new Fetchable which writes to a localStorage value when updated.
 *
 * @param name The name of the localStorage value.
 * @param value The initial value of this Fetchable
 * @see Fetchable
 */
export function storedFetchable<T>(name: string, value: T | undefined = undefined): Fetchable<T> {
    let item = localStorage.getItem(name)
    let store = item ? fetchable<T>(JSON.parse(item)) : fetchable<T>(value)
    store.subscribe((it) => {
        localStorage.setItem(name, JSON.stringify(it))
    })

    return store
}


/**
 * Creates a new Fetchable which writes to a localStorage value when updated.
 * Uses a serializer and deserializer function.
 *
 * @param name The name of the localStorage value.
 * @param value The initial value of this Fetchable
 * @param serializer Serializes T into TData
 * @param deserializer Deserializes TData into T
 * @see Fetchable
 */
export function serializingStoredFetchable<T, TData extends object>(
    name: string,
    value: T | undefined = undefined,
    serializer: (value: T) => TData,
    deserializer: (value: TData) => T
): Fetchable<T> {
    let item = localStorage.getItem(name)
    let store : Fetchable<T>
    try {
        store = item ? fetchable<T>(deserializer(JSON.parse(item) as TData)) : fetchable<T>(value)
    } catch (e) {
        store = fetchable<T>(value)
    }

    store.subscribe((it) => {

        if (it == undefined) {
            localStorage.removeItem(name);
            return
        }
        let serialized = serializer(it)
        if (serialized == undefined) {
            localStorage.removeItem(name);
            return
        }
        localStorage.setItem(name, JSON.stringify(serialized))
    })

    return store
}
