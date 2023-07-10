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
export function fetchable<T>(value: T | undefined = undefined) : Fetchable<T> {
    let store = writable<T>(value)

    let fetchable = {
        cachedValue: <T | undefined> undefined,
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
