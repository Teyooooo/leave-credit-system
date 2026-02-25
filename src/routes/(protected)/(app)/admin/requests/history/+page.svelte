<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import { columns } from '$lib/components/history-request-table/history-request-column';
	import HistoryRequestTable from '$lib/components/history-request-table/history-request-table.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    $web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Requests', route: '/admin/requests' },
		{ path_name: 'History', route: '/admin/requests/history' }
	];

    let { data }: PageProps = $props();
    let { leaveHistory } = $derived(data)


</script>

<BackButton route={'/admin/requests'} />

<div class="mx-4">
    <HistoryRequestTable data={leaveHistory} {columns} />
</div>