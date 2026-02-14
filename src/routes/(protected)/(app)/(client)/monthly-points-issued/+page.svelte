<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import { columns } from '$lib/components/issued-log-table/issued-logs-column';
	import IssuedLogsTableV2 from '$lib/components/issued-log-table/issued-logs-table-v2.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { convertTimestamp } from '$lib/utils/helper';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    $web_path_header = [
		{ path_name: 'Monthly Points Issued', route: '/monthly-points-issued' }
	];

    const lateReport = $derived(data.lateReport || {minutes: 0, date: ''})
    const issuedLogs = $derived(data.issuedLogs)

</script>

<div class="flex justify-between items-center me-5">
    <HeaderPage title={'Monthly Points Issued'} message={'See how many points employees earned each month and what they were issued for.'}/>

    <div class="text-xl">
        <p class="font-light">{lateReport?.date ? convertTimestamp(lateReport?.date , 'monthYear') : 'Monthly'} Late Report</p>
        <p class="font-semibold">
            {lateReport?.minutes} {lateReport?.minutes > 0 ? 'minutes' : 'minute'}
        </p>
    </div>
</div>
<div class="px-3 mt-10">
    <IssuedLogsTableV2 data={issuedLogs || []} {columns}/>
</div>