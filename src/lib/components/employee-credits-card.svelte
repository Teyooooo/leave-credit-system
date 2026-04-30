<script lang="ts">
	import { convertTimestamp } from "$lib/utils/helper";

    let { creditPoints } = $props()


    const vacation_leave_points = $derived(creditPoints?.vacation_leave_points ?? 0 )
    const sick_leave_points = $derived(creditPoints?.sick_leave_points ?? 0 )
    const late_per_mins = $derived(creditPoints?.late_per_mins ?? 0 )
    const latest_update_date = $derived(creditPoints?.updated_at ?? '') 

    // svelte-ignore state_referenced_locally
        console.log({creditPoints})

</script>

<div class="border-t flex justify-center text-lg">
    <div class="border-s p-3 w-65">
        <p class="font-light">Vacation Leave Balance</p>
        <p class="font-semibold">{vacation_leave_points}</p>
    </div>
    <div class="border-s border-e p-3 w-65">
        <p class="font-light">Sick Leave Balance</p>
        <p class="font-semibold">{sick_leave_points}</p>
    </div>
    <div class="border-e p-3 w-65">
        <p class="font-light">{latest_update_date ? convertTimestamp(latest_update_date, 'monthYear') : 'Monthly'} Late Report</p>
        <p class="font-semibold">
            {late_per_mins} {late_per_mins > 0 ? 'minutes' : 'minute'}
        </p>
    </div>
</div>