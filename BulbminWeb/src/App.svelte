<script lang="ts">
    import ConnectionPage from "./lib/ConnectionPage.svelte";
    import { version } from "../../package.json"
</script>

<ConnectionPage/>

<div class="absolute text-leaf-450 bottom-1 right-2 font-[monospace]">
    v{version}
</div>