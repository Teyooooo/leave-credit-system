<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import { columns } from '$lib/components/history-request-table/history-request-client-column';
	import HistoryRequestTable from '$lib/components/history-request-table/history-request-table.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    $web_path_header = [
        { path_name: 'Leave Request', route: '/leave-request' },
        { path_name: 'History', route: '/leave-request/history' },
    ];
    let { data }: PageProps = $props();
    let { leaveHistory } = $derived(data)
    

</script>

<BackButton route={"/leave-request"} />

<div class="mx-4">
    <HistoryRequestTable data={leaveHistory} {columns} />
</div>