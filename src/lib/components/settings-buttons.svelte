<script lang="ts">
	import type { MenuItem } from '$lib/types/icon';
	import { File, FolderClock, Megaphone, UserRound, UserRoundX } from '@lucide/svelte';

	const tabs: MenuItem[] = [
		{
			title: 'Activity Logs',
			url: '/admin/settings/activity-logs',
			icon: FolderClock
		},
		{
			title: 'Campus Director',
			url: '/admin/settings/campus-director',
			icon: UserRound
		},
		{
			title: 'Announcements',
			url: '/admin/settings/announcements',
			icon: Megaphone
		},
        {
            title: 'Template',
            url: '/admin/settings/template',
            icon: File,
        },
		{
            title: 'Inactive Accounts',
            url: '/admin/settings/inactive-accounts',
            icon: UserRoundX,
        }
	];
</script>


<div class="grid gap-5 w-[50%] mx-auto mt-10">
    {#each tabs as tab}
         <a href={tab.url} class="w-full h-20 flex items-center ps-5 gap-3 bg-sidebar hover:bg-sidebar-primary hover:text-sidebar-accent-foreground rounded-md text-xl border-border border">
             <tab.icon />
             <span>{tab.title}</span>
        </a>
    {/each}
</div>