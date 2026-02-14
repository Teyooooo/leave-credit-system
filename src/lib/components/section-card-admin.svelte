<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<div
	class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 dark:*:data-[slot=card]:bg-card"
>
	<div class="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 ">
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Yearly Total VL & SL Credits Issued</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					60
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Month Total Approved Leaves</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					2
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>
	<div class="grid grid-cols-1 gap-4 @lg/main:grid-cols-3">
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Total Employees</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					40
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
					5
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<a href="/admin/requests" class="text-muted-foreground hover:underline">View all pending requests</a>
			</Card.Footer>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Total Declined Leaves</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					14
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<a href="/admin/requests" class="text-muted-foreground hover:underline">View all request history</a>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
