<script lang="ts">

    import {type Toast, toaster, TOAST_LIVE_TIME} from "../../util/toast";
    import {fly} from "svelte/transition";
    import {flip} from "svelte/animate";


    const drainBar = (node: HTMLSpanElement) => {
        return {
            delay: 0,
            duration: TOAST_LIVE_TIME,
            css: (t: number) => {
                return `width: ${100 - (t*100)}%`
            }
        }
    }

    const killToast = (toast: Toast) => {
        toaster.remove(toast)
    }
</script>


<div class="fixed top-3 right-3 flex flex-col" style="z-index: 2391492059;">
    {#each $toaster.toReversed() as toast (toast)}
        <div class="bg-leaf-600 border-leaf-500 border w-72 max-h-32 overflow-x-clip rounded p-4 pt-3.5 pb-2 m-1" transition:fly={{x: 200, duration: 500}}>
            <img src="x-button.svg" width="12" height="12" alt="close" class="float-right cursor-pointer ml-1 mr-0.5 mt-0.5" on:click={() => killToast(toast)}>
            <p class="text-sm break-words">{toast.body}</p>
            <div class="w-full h-2 bg-leaf-800 border border-leaf-700 rounded mt-1 mb-1">
                <div in:drainBar class="w-0 rounded bg-leaf-450 h-full"></div>
            </div>
        </div>
    {/each}
</div>