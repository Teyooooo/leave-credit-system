<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import type { CreditPointsInfo } from "$lib/types/data";
	import { convertTimestamp } from "$lib/utils/helper";

	let { creditInfo, currentStatus } : {creditInfo: CreditPointsInfo | undefined, currentStatus: string} = $props()

	const requestStatus = {
		pending : {
			color : "bg-amber-300",
			name: "Pending"
		},
		none : {
			color : "bg-gray-300",
			name: "None"
		},
		approved : {
			color : "bg-green-300",
			name: "Approved"
		},
		declined : {
			color : "bg-red-300",
			name: "Declined"
		}
	}

	const statusKey = $derived(currentStatus?.toLowerCase() ?? 'none') as keyof typeof requestStatus
	const status = $derived(requestStatus[statusKey] || requestStatus.none)


</script>

<div
	class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Vacation Leave Points</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{creditInfo?.vacation_leave_points || 0}
			</Card.Title>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<a href="/leave-request" class="text-muted-foreground hover:underline">Request a leave</a>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Sick Leave Points</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{creditInfo?.sick_leave_points || 0}
			</Card.Title>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<a href="/leave-request" class="text-muted-foreground hover:underline">Request a leave</a>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Request Status</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex gap-2 items-center">
				<span class="size-8  rounded-full {status.color}"></span>
				<p>{status.name}</p> 
			</Card.Title>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<a href="/leave-request/history" class="text-muted-foreground hover:underline">View all request history</a>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>{creditInfo?.updated_at ? convertTimestamp(creditInfo?.updated_at , 'monthYear') : 'Monthly'} Late Report</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{creditInfo?.late_per_mins ?? 0} {(creditInfo?.late_per_mins ?? 0) > 0  ? 'minutes' : 'minute'}
			</Card.Title>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<a href="/monthly-points-issued" class="text-muted-foreground hover:underline">View monthly report</a>
		</Card.Footer>
	</Card.Root>
</div>
