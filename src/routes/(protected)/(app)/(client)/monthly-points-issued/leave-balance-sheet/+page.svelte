<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import LeaveBalanceSheetTable from '$lib/components/leave-balance-sheet-table.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

	$web_path_header = [
		{ path_name: 'Monthly Points Issued', route: '/monthly-points-issued' },
		{ path_name: 'Leave Balance Sheet', route: '/monthly-points-issued/leave-balance-sheet' }
	];

    let { data }: PageProps = $props();
	let { balanceSheetData } = $derived(data)


</script>

<BackButton route={'/monthly-points-issued'} />

<LeaveBalanceSheetTable data={balanceSheetData} />