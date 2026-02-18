<script lang="ts">
	import LeaveBalanceSheetTable from '$lib/components/leave-balance-sheet-table.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();

	$web_path_header = [
		{ path_name: 'Monthly Points Issued', route: '/monthly-points-issued' },
		{ path_name: 'Leave Balance Sheet', route: '/monthly-points-issued/leave-balance-sheet' }
	];

</script>

<LeaveBalanceSheetTable />