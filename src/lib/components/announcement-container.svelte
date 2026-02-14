<script lang="ts">
	import type { AnnouncementInfo } from '$lib/types/data';
	import { filterArray, segregateAnnouncements } from '$lib/utils/helper';
	import { Megaphone, Search } from '@lucide/svelte';
	import AnnouncementCard from './announcement-card.svelte';
	import { Input } from './ui/input';
	import * as Tabs from './ui/tabs';

	let { announcements }: { announcements: AnnouncementInfo[] } = $props();

	let tabValue = $state('all');
	let searchTerm = $state('');

	let { allAnnouncements, activeAnnouncements, upcomingAnnouncements, expiredAnnouncements } =
		$derived(segregateAnnouncements(announcements));

	let filteredItems = $derived.by(() => {
		let sourceArray: AnnouncementInfo[];

		switch (tabValue) {
			case 'active':
				sourceArray = activeAnnouncements;
				break;
			case 'upcoming':
				sourceArray = upcomingAnnouncements;
				break;
			case 'expired':
				sourceArray = expiredAnnouncements;
				break;
			default:
				sourceArray = allAnnouncements;
				break;
		}

		return filterArray(searchTerm, sourceArray, 'title');
	});
</script>

<div class="grid gap-10">
	<Input class="w-auto" placeholder="Search announcement..." bind:value={searchTerm} />

	<div class="grid gap-5">
		<Tabs.Root bind:value={tabValue} class="w-full">
			<Tabs.List class="mb-5">
				<Tabs.Trigger value="all">All</Tabs.Trigger>
				<Tabs.Trigger value="active">Active</Tabs.Trigger>
				<Tabs.Trigger value="upcoming">Upcoming</Tabs.Trigger>
				<Tabs.Trigger value="expired">Expired</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="all">
				{#if filteredItems.length === 0}
					{#if searchTerm}
						 <div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Search />
							</div>
							<p class="text-base font-medium text-muted-foreground">No results found</p>
							<p class="text-sm text-muted-foreground/60 mt-1">Try a different search term</p>
						</div>
					{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Megaphone />
							</div>
							<p class="text-muted-foreground text-center">No Announcement Yet...</p>
						</div>
					{/if}
				{:else}
					{#each filteredItems as item}
						<AnnouncementCard {item} />
					{/each}
				{/if}
			</Tabs.Content>
			<Tabs.Content value="active">
				{#if filteredItems.length === 0}
					{#if searchTerm}
						 <div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Search />
							</div>
							<p class="text-base font-medium text-muted-foreground">No results found</p>
							<p class="text-sm text-muted-foreground/60 mt-1">Try a different search term</p>
						</div>
					{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Megaphone />
							</div>
							<p class="text-muted-foreground text-center">No Active Announcement Yet...</p>
						</div>
					{/if}
				{:else}
					{#each filteredItems as item}
						<AnnouncementCard {item} />
					{/each}
				{/if}
			</Tabs.Content>
			<Tabs.Content value="upcoming">
				{#if filteredItems.length === 0}
					{#if searchTerm}
						 <div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Search />
							</div>
							<p class="text-base font-medium text-muted-foreground">No results found</p>
							<p class="text-sm text-muted-foreground/60 mt-1">Try a different search term</p>
						</div>
					{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Megaphone />
							</div>
							<p class="text-muted-foreground text-center">No Upcoming Announcement Yet...</p>
						</div>
					{/if}
				{:else}
					{#each filteredItems as item}
						<AnnouncementCard {item} />
					{/each}
				{/if}
			</Tabs.Content>
			<Tabs.Content value="expired">
				{#if filteredItems.length === 0}
					{#if searchTerm}
						 <div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Search />
							</div>
							<p class="text-base font-medium text-muted-foreground">No results found</p>
							<p class="text-sm text-muted-foreground/60 mt-1">Try a different search term</p>
						</div>
					{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="rounded-full bg-muted p-3 mb-4">
								<Megaphone />
							</div>
							<p class="text-muted-foreground text-center">No Expired Announcement Yet...</p>
						</div>
					{/if}
				{:else}
					{#each filteredItems as item}
						<AnnouncementCard {item} />
					{/each}
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
