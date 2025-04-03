<script lang="ts">

    import type {Snippet} from "svelte";

    const {
        children,
        class: className = ""
    }: {
        children: Snippet,
        class?: string
    } = $props();

</script>

<div class="mt-4 mb-1 p-3 border-leaf-500 border bg-leaf-700 rounded relative {className}">
    {@render children()}
</div>