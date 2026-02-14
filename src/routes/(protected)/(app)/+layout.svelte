<script lang="ts">
	import AnnouncementBar from "$lib/components/announcement-bar.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import SiteHeader from "$lib/components/site-header.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { web_path_header } from "$lib/store/webDesignStore.js";

	let { children, data }  = $props();
    let { employee, activeAnnouncements } = $derived(data);

</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar {employee}/>
	<Sidebar.Inset>
		<SiteHeader header_paths={$web_path_header}/>
		{#if activeAnnouncements.length === 0}
			 <AnnouncementBar announcements={activeAnnouncements} />
		{/if}
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					{@render children()}
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

