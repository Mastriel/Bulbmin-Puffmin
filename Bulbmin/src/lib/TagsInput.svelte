<script lang="ts">

    export let options : string[]

    export let values : string[] = []

    export let className : string

    let valuesListVisible = false

    let inputElement : HTMLInputElement

    let shownOptions = options

    export let valuesChange : (values: string[]) => void

    const onOptionClick = (option: string) => {
        inputElement.value = option
        inputElement.focus()
    }

    const makeListInvisible = () => {
        setTimeout(() => {
            valuesListVisible = false
        }, 100)
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
        values.push(correctedValue)
        values = values
        shownOptions = options
        valuesChange(values)
    }

    const removeValue = (value: string) => {
        values = values.filter(it => it != value)
        valuesChange(values)
    }
</script>


<div class={className}>
    <div class="flex justify-between w-full">
        <div class="flex justify-between items-end">
            <div></div>
            <div class="h-6">
                <input class="pl-2 pr-2 bg-transparent outline-0" on:keypress={inputKeyPress} on:input={onInput} bind:this={inputElement} on:focus={() => valuesListVisible = true} on:blur={() => makeListInvisible()}>
                <button class="relative pl-2 pr-2 bg-gray-700 border rounded border-gray-600" style="translate: 0 -1px" on:click={() => insertValue()}>Add</button>
            </div>
        </div>
        <div class="w-1 ml-1 border-r border-r-gray-500"></div>

        <div class="ml-1 flex-1 flex flex-row gap-y-2 flex-wrap">
            {#each values as value}
                <button tabindex="-1" class="rounded pl-2 pr-2 ml-1 mr-1 bg-gray-700 outline-1 outline outline-gray-600" on:click={() => removeValue(value)}>
                    <span>{value}</span>
                </button>
            {/each}
        </div>
    </div>
    {#if valuesListVisible}
        <div class="absolute bg-slate-700 translate-y-1 -translate-x-1 w-1/3 rounded max-h-32 overflow-y-scroll border-slate-500 border">
            {#each shownOptions as option, i}
                <p class="ml-2" on:click={() => onOptionClick(option)}>{option}</p>
                {#if i !== shownOptions.length-1}
                    <hr class="border-gray-500">
                {/if}
            {/each}
        </div>
    {/if}
</div>
