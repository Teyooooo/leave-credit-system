<script lang="ts">
	import Greetings from '$lib/components/greetings.svelte';
	import SectionCards from '$lib/components/section-cards.svelte';
	import TableRecentReports from '$lib/components/table-recent-reports.svelte';
	import { web_path_header } from '$lib/store/webDesignStore.js';
	import type { CreditPointsInfo } from '$lib/types/data.js';

	$web_path_header = [
		{ path_name: 'Dashboard', route: '#' }
	];

	let { data } = $props()

	const employee = $derived(data.employee)
	const creditInfo: CreditPointsInfo | undefined = $derived(data.creditInfo)
	const currentStatus = $derived(data.currentStatus || 'none')
    const recentReports = $derived(data.recentReports || [])


</script>

<Greetings {employee} />
<SectionCards {creditInfo} {currentStatus} />
<TableRecentReports {recentReports} />