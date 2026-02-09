<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { PathHeader } from "$lib/types/data";
	import SlashIcon from "@lucide/svelte/icons/slash";
	import dayjs from 'dayjs';

	export let header_paths: PathHeader[];

</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ms-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<h1 class="text-base font-medium">
			<Breadcrumb.Root>
				<Breadcrumb.List>
					{#each header_paths as path, i}
						<Breadcrumb.Item>
							<Breadcrumb.Link href={path.route}>{path.path_name}</Breadcrumb.Link>
						</Breadcrumb.Item>

						{#if i + 1 < header_paths.length}
							 <Breadcrumb.Separator>
								<SlashIcon />
							</Breadcrumb.Separator>
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</h1>
		<div class="ms-auto flex items-center gap-2">
			<p>{dayjs(new Date()).format('dddd, MMMM D, YYYY')}</p>
		</div>
	</div>
</header>
