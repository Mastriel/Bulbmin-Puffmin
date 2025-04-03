import {useStatePtr} from "./fetchable.svelte";

export type ToastSvelte = {
    body: string,
    icon?: string
}


export class Toaster {

    private _toasts: ToastSvelte[] = $state.raw([])

    public get toasts(): readonly ToastSvelte[] { return this._toasts }

    private timers = new Map<ToastSvelte, number>()

    public constructor() {

    }

    public push(toast: ToastSvelte) {
        this._toasts.push(toast)

        this.timers.set(toast, window.setTimeout(() => {
            this.remove(toast)
        }, TOAST_LIVE_TIME))

        this._toasts = [...this._toasts];
    }

    public remove(toast: ToastSvelte) {
        let timer = this.timers.get(toast)
        if (timer) window.clearTimeout(timer)

        this.timers.delete(toast)

        // make this better
        let index = this._toasts.indexOf(toast)
        if (index != -1) {
            this._toasts.splice(index, 1)
        }
        this._toasts = [...this._toasts];
    }
}


export const TOAST_LIVE_TIME = 8000

export const toaster = useStatePtr(new Toaster())