<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import type { RecentReports } from '$lib/types/data';
	import { convertTimestamp, sortArray } from '$lib/utils/helper';

	let { recentReports }: { recentReports: RecentReports[] } = $props();
	let sortedReports = $derived(sortArray(recentReports, 'timestamp'));
	
</script>

<Card.Root class="mx-4 lg:mx-6">
	<Card.Header class="flex items-center justify-between">
		<Card.Title>Recent Reports</Card.Title>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-40">Timestamp</Table.Head>
					<Table.Head class="w-40">Type</Table.Head>
					<Table.Head>Details</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if recentReports.length === 0}
					<Table.Row>
						<Table.Cell colspan={3} class="text-center text-muted-foreground">
							No data available
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each sortedReports as report}
						<Table.Row>
							<Table.Cell class="font-medium"
								>{convertTimestamp(report.timestamp, 'full')}</Table.Cell
							>
							<Table.Cell>{report.type}</Table.Cell>
							<Table.Cell>{report.details}</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
