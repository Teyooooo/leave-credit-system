<script lang="ts">
 import { Button } from "$lib/components/ui/button/index.js";
 import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "@lucide/svelte";
 import type { Column } from "@tanstack/table-core";
 import type { ComponentProps } from "svelte";
 
 let { 
   variant = "ghost", 
   column,
   ...restProps 
 }: ComponentProps<typeof Button> & { column?: Column<any, any> } = $props();

 const sortDirection = $derived(column?.getIsSorted());
</script>
 
<Button {variant} {...restProps}>
 Period
 {#if sortDirection === "asc"}
   <ArrowUpIcon class="ms-2 h-4 w-4" />
 {:else if sortDirection === "desc"}
   <ArrowDownIcon class="ms-2 h-4 w-4" />
 {:else}
   <ArrowUpDownIcon class="ms-2 h-4 w-4" />
 {/if}
</Button>