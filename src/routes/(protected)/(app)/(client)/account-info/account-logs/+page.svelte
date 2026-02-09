<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';
	import { columns } from './column';
	import DataTable from './data-table.svelte';

    let { data }: PageProps = $props();

    $web_path_header = [
        {path_name:'Account Information', route: '/account-info'},
        {path_name: "Activity Log", route: "/account-info/account-logs" }
    ];

    const logs = $derived(data.logs || [])

</script>


<HeaderPage title={'Activity Logs'} message={'Track and review your recent activities and actions within the system.'}/>
<div class="mx-5">
    <DataTable data={logs} {columns} />
</div>
