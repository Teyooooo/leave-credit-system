<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';
	import { columns } from './column';
	import DataTable from './data-table.svelte';

    let { data }: PageProps = $props();


    $web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Settings', route: '/admin/settings' },
		{ path_name: 'Activity Logs', route: '/admin/settings/activity-logs' }
	];

    const logs = $derived(data.logs || [])

</script>

<HeaderPage title={'Activity Logs'} message={'Monitor and review employee activities and system actions for tracking and compliance.'} />

<div class="mx-5">
    <DataTable data={logs} {columns} />
</div>