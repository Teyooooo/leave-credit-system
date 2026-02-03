<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { MenuItem } from '$lib/types/icon';

	let { items }: { items: MenuItem[] } = $props();

	function isActive(itemUrl: string, currentPath: string): boolean {
		// Exact match for root
		if (itemUrl === '/') {
			return currentPath === '/';
		}
		// Check if current path starts with the item URL
		return currentPath.startsWith(itemUrl);
	}
</script>

<Sidebar.Group>
	<Sidebar.GroupContent class="mt-5 flex flex-col gap-3">
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						tooltipContent={item.title}
						isActive={isActive(item.url, $page.url.pathname)}
					>
						<a href={item.url} class="flex items-center gap-2 p-1">
							<item.icon />
							<span>{item.title}</span>
						</a>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
