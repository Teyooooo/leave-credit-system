<script lang="ts">
	import { columns } from '$lib/components/history-request-table/history-request-client-column';
	import HistoryRequestTable from '$lib/components/history-request-table/history-request-table.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    const {issuedLeave} = $derived(data)

    $effect(() => {
        $web_path_header = [
            { path_name: 'Issued Leave', route: '/issued-leave' },
        ]
    })

	// svelte-ignore state_referenced_locally
	console.log({data})


</script>

<div class="mx-4">
    <HistoryRequestTable data={issuedLeave} {columns} />
</div>