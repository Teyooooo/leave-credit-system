<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import { columns } from '$lib/components/history-request-table/history-request-column';
	import HistoryRequestTable from '$lib/components/history-request-table/history-request-table.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    $web_path_header = [
		{ path_name: 'Approve Request', route: '/approve-request' },
		{ path_name: 'History', route: '/approve-request/history' }

	];

    let { data }: PageProps = $props();
    let { leaveHistory } = $derived(data)


</script>

<BackButton route={'/admin/requests'} />

<div class="mx-4">
    <HistoryRequestTable data={leaveHistory} {columns} />
</div>