import type {Invalidator, Readable, Subscriber, Unsubscriber, Writable} from "svelte/store";
import {writable} from "svelte/store";


export type Toast = {
    body: string,
    icon?: string
}


export class Toaster implements Readable<Toast[]> {

    private readonly reaction : Writable<Toast[]> = writable([])

    private _toasts: Toast[] = []

    public get toasts(): readonly Toast[] { return this._toasts }

    private timers = new Map<Toast, number>()

    subscribe = this.reaction.subscribe

    public constructor() {

    }

    public push(toast: Toast) {
        this._toasts.push(toast)

        this.timers.set(toast, window.setTimeout(() => {
            this.remove(toast)
        }, TOAST_LIVE_TIME))

        this.update()
    }

    public remove(toast: Toast) {
        let timer = this.timers.get(toast)
        if (timer) window.clearTimeout(timer)

        this.timers.delete(toast)
        this._toasts = this._toasts.filter(it => it != toast)
        this.update()
    }

    private update() {
        this.reaction.set(this._toasts)
    }
}


export const TOAST_LIVE_TIME = 8000

export const toaster = new Toaster()