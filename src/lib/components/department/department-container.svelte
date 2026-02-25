<script lang="ts">
	import DepartmentCard from '$lib/components/department/department-card.svelte';
	import type { Department, UserIcon } from '$lib/types/data';
	import { Search } from '@lucide/svelte';

	let { listOfDepartments, listOfEmployees }: { listOfDepartments: Department[]; listOfEmployees:UserIcon[]} = $props();

</script>

<div class="mx-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
	{#if listOfDepartments.length === 0}
		<div class="flex flex-col items-center justify-center py-12 text-center col-span-1 lg:col-span-2 xl:col-span-3">
			<div class="rounded-full bg-muted p-3 mb-4">
				<Search />
			</div>
			<p class="text-base font-medium text-muted-foreground">No results found</p>
			<p class="text-sm text-muted-foreground/60 mt-1">Try a different search term</p>
		</div>
	{:else}
		 {#each listOfDepartments as department}
		 <!-- <div> -->
			<DepartmentCard {department} {listOfEmployees} />
		 <!-- </div> -->
		 {/each}
	{/if}
</div>

