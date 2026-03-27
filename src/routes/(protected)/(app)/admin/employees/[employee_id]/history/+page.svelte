<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import { columns } from '$lib/components/history-request-table/history-request-client-column';
	import HistoryRequestTable from '$lib/components/history-request-table/history-request-table.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    const {params, current_employee_info, issuedLeave} = $derived(data)

    $effect(() => {
        $web_path_header = [
            { path_name: 'Admin', route: '/admin/dashboard' },
            { path_name: 'Employees', route: '/admin/employees' },
            { path_name: current_employee_info?.name || 'User', route: `/admin/employees/${params}` },
            { path_name: 'History', route: `/admin/employees/${params}/history` }
        ]
    })

	// svelte-ignore state_referenced_locally
	console.log({data})


</script>

<BackButton route={`/admin/employees/${params}`} />

<div class="mx-4">
    <HistoryRequestTable data={issuedLeave} {columns} />
</div>