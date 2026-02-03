<script lang="ts">
	import ThemeMode from "$lib/components/theme-mode.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { WithoutChildren } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	import type { MenuItem } from "$lib/types/icon";

	let { items, ...restProps  }: { items: MenuItem[] } & WithoutChildren<ComponentProps<typeof Sidebar.Group>>= $props();
</script>

<Sidebar.Group {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
		<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						<ThemeMode />
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
