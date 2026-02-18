<script lang="ts">
	import LeaveBalanceSheetTable from '$lib/components/leave-balance-sheet-table.svelte';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<LeaveBalanceSheetTable />