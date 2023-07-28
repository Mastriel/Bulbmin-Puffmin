<script lang="ts">

    export let options : string[]

    export let values : string[] = []

    export let className : string

    export let valuesChange : (values: string[]) => void

    export let transformer : (value: string) => (string[] | undefined) = () => undefined

    export let immutable : boolean = false

    let valuesListVisible = false

    let inputElement : HTMLInputElement

    let shownOptions = options


    const onOptionClick = (option: string) => {
        if (values.includes(option)) return
        insertValue(option)
        inputElement.value = ""
    }

    const makeListInvisible = () => {
        setTimeout(() => {
            valuesListVisible = false
        }, 150)
    }
    const onInput = (ev: InputEvent) => {
        console.log(ev.data)
        shownOptions = options.filter((it) => it.toLowerCase().includes(inputElement.value.toLowerCase()))
    }
    const inputKeyPress = (ev: KeyboardEvent) => {
        if (ev.key == "Enter") {
            insertValue()
        }
    }

    const insertValue = (value: string = inputElement.value) => {
        if (value.includes(",")) {
            let values = inputElement.value.split(",")
            values.forEach(it => insertValue(it))
            return
        }
        let correctedValue = options.find(it => it.toLowerCase() == value.toLowerCase())
        if (!correctedValue) return
        if (values.includes(correctedValue)) return
        inputElement.value = ""

        let transformedValue = transformer(correctedValue)
        if (transformedValue) {
            transformedValue.forEach(it => insertValue(it))
            return
        }

        values.push(correctedValue)
        values = values
        shownOptions = options
        valuesChange(values)
    }

    const removeValue = (value: string) => {
        if (immutable) return
        values = values.filter(it => it != value)
        valuesChange(values)
    }
</script>


<div class={className}>
    <div class="flex justify-between w-full">
        <div class="flex-1 flex flex-row gap-y-2 flex-wrap">
            {#each values as value}
                <button tabindex="-1" class="rounded pl-2 pr-2 mr-2 bg-leaf-600 outline-1 outline outline-leaf-500"
                        class:cursor-not-allowed={immutable}
                        on:click={() => removeValue(value)}>
                    <span>{value}</span>
                    {#if !immutable}
                        <img src="x-button.svg" alt="Remove key" height="12" width="12" class="inline-block pl-1 -translate-y-0.5">
                    {/if}
                </button>
            {/each}
            {#if !immutable}
                <input class="pl-1 pr-2 bg-transparent outline-0 border-t-leaf-500 w-full border-0 pb-0"
                       class:border-t={values.length > 0}
                       class:pt-1={values.length > 0}
                       placeholder="Enter keys..."
                       on:keypress={inputKeyPress}
                       on:input={onInput}
                       bind:this={inputElement}
                       on:focus={() => valuesListVisible = true}
                       on:focusout={() => makeListInvisible()}>
            {/if}
        </div>
    </div>
    <div class="absolute list pb-4" class:opacity-0={!valuesListVisible} class:pointer-events-none={!valuesListVisible} style="z-index: 10">
        <div class="bg-leaf-700 translate-y-1 -translate-x-1 rounded max-h-32 overflow-y-scroll scroll border-leaf-500 border" style="width: 18.5rem;">
            {#each shownOptions as option, i}
                <div class="list-element cursor-pointer" on:click={() => onOptionClick(option)}>
                    <p class="pl-2">{option}</p>
                    {#if i !== shownOptions.length-1}
                        <hr class="border-leaf-500">
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>


<style>
    .scroll::-webkit-scrollbar {
        @apply rounded-3xl;
        width: 8px;
    }

    .scroll::-webkit-scrollbar-track {
        @apply bg-leaf-700 rounded-3xl;
    }

    .scroll::-webkit-scrollbar-thumb {
        @apply bg-leaf-800 rounded-3xl;
    }

    .list {
        transition: opacity 200ms ease-in-out;
    }

    .list-element {
        transition: background-color 100ms ease-in-out;
    }

    .list-element:hover {
        @apply bg-leaf-600;
    }
</style>