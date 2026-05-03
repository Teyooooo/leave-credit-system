<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { MenuItem } from '$lib/types/icon';
	import { FileCheckCorner, type Menu } from '@lucide/svelte';
	import { Separator } from '../ui/separator';

	let { items, employeePosition, isAdminRoute }: { items: MenuItem[]; employeePosition: string; isAdminRoute: boolean } = $props();

	function isActive(itemUrl: string, currentPath: string): boolean {
		// Exact match for root
		if (itemUrl === '/') {
			return currentPath === '/';
		}
		// Check if current path starts with the item URL
		return currentPath.startsWith(itemUrl);
	}

	const higherPositions = ["department head", "campus director"];
	const higherPositionsPages: MenuItem[] = [
		{
			title: "Approve Request",
			url: "/approve-request",
			icon: FileCheckCorner,
		},
	]
</script>
<Sidebar.Group>
	<Sidebar.GroupContent class="mt-5 flex flex-col gap-3">
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						tooltipContent={item.title}
						isActive={isActive(item.url, page.url.pathname)}
					>
						<a href={item.url} class="flex items-center gap-2 p-1 w-full">
							<item.icon />
							<span>{item.title}</span>
						</a>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
	
	{#if (employeePosition.toLowerCase().trim() === 'department head' || employeePosition.toLowerCase().trim() === 'campus director') && !isAdminRoute}
		<Separator class="my-5" />
		 <Sidebar.GroupContent class="flex flex-col gap-3">
			<Sidebar.Menu>
			{#each higherPositionsPages as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						tooltipContent={item.title}
						isActive={isActive(item.url, page.url.pathname)}
					>
						<a href={item.url} class="flex items-center gap-2 p-1 w-full">
							<item.icon />
							<span>{item.title}</span>
						</a>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
			</Sidebar.Menu>
		</Sidebar.GroupContent>
	{/if}
</Sidebar.Group>
