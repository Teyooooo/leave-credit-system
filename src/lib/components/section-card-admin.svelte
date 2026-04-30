<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { AdminDashboardInfo } from '$lib/types/data';

	let { data } : { data:AdminDashboardInfo } = $props()

</script>

<div
	class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Total Employees</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{data.employees}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<a href="/admin/employees" class="text-muted-foreground hover:underline">View employees</a>
			</Card.Footer>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Total Pending Leave Requests</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{data.pending}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<a href="/admin/requests" class="text-muted-foreground hover:underline">View all pending requests</a>
			</Card.Footer>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Total Approved Leave Requests</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{data.approved}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<a href="/admin/requests/history" class="text-muted-foreground hover:underline">View all request history</a>
			</Card.Footer>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Total Declined Leave Requests</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{data.declined}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<a href="/admin/requests/history" class="text-muted-foreground hover:underline">View all request history</a>
			</Card.Footer>
		</Card.Root>
</div>
