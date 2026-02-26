<script lang="ts">
    let { value }: { value: number } = $props();
</script>

{#if value === 0}
    <span>-</span>
{:else}
    <p class="text-red-600">{value} {value > 1 ? 'mins' : 'min'}</p>
{/if}