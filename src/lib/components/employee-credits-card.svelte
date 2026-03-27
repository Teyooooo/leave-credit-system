<script lang="ts">
	import type { CreditPointsInfo } from '$lib/types/data';

	let { creditPoints }: { creditPoints: CreditPointsInfo | undefined } = $props();

	const vacation_leave_points = $derived(creditPoints?.vacation_leave_points ?? 0);
	const sick_leave_points = $derived(creditPoints?.sick_leave_points ?? 0);
	const late_per_mins = $derived(creditPoints?.late_per_mins ?? 0);
	const period = $derived(creditPoints?.period ?? '-');

	// svelte-ignore state_referenced_locally
	console.log({ creditPoints });
</script>

<div class="flex justify-center border-t text-lg">
	<div class="w-65 border-s border-e p-3">
		<p class="font-light">Sick Leave Balance</p>
		<p class="font-semibold">{sick_leave_points}</p>
	</div>
	<div class="w-65 border-s p-3">
		<p class="font-light">Vacation Leave Balance</p>
		<p class="font-semibold">{vacation_leave_points}</p>
	</div>
	<div class="w-65 border-e p-3">
		<p class="font-light">{period} Late Report</p>
		<p class="font-semibold">
			{late_per_mins}
			{late_per_mins > 0 ? 'minutes' : 'minute'}
		</p>
	</div>
</div>
