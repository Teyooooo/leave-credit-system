<script lang="ts">
    let { value }: { value: number } = $props();

    // svelte-ignore state_referenced_locally
        console.log({value})

</script>

{#if value === 0.000}
    <span>-</span>
{:else}
    <p class="text-red-600">{value}</p>
{/if}