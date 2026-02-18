<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Download } from '@lucide/svelte';
	import * as Table from './ui/table';

	let travel_balance = 100.3;
	let sick_balance = 90.2;
</script>

	<div class="mx-4 mt-5 flex justify-between items-center">
		<p class="text-xl font-bold">{'2026 Leave Balance Sheet'}</p>

		<Button>
			<Download /> Export as PDF
		</Button>
	</div>

	<Table.Root
		class="mx-auto w-[calc(100vw-2rem)] table-fixed border-collapse border [&_td]:border [&_td]:text-center [&_th]:border [&_th]:text-center [&_th]:font-bold mb-3"
	>
		<Table.Header>
			<Table.Row>
				<Table.Head rowspan={3} class="w-[100px]">PERIOD</Table.Head>
				<Table.Head rowspan={3} class="w-[200px]">PARTICULARS</Table.Head>
				<Table.Head colspan={4}>VACATION LEAVE</Table.Head>
				<Table.Head colspan={4}>SICK LEAVE</Table.Head>
				<Table.Head rowspan={3} class="w-[250px]">REMARKS</Table.Head>
			</Table.Row>
			<Table.Row class="[&_th]:w-[100px]">
				<Table.Head rowspan={2}>EARNED</Table.Head>
				<Table.Head rowspan={2} class="wrap-break-words whitespace-normal"
					>Absence Undertime w/ Pay</Table.Head
				>
				<Table.Head>BALANCE</Table.Head>
				<Table.Head rowspan={2} class="wrap-break-words whitespace-normal"
					>Absence Undertime w/o Pay</Table.Head
				>
				<Table.Head rowspan={2}>EARNED</Table.Head>
				<Table.Head rowspan={2} class="wrap-break-words whitespace-normal"
					>Absence Undertime w/ Pay</Table.Head
				>
				<Table.Head>BALANCE</Table.Head>
				<Table.Head rowspan={2} class="wrap-break-words whitespace-normal"
					>Absence Undertime w/o Pay</Table.Head
				>
			</Table.Row>
			<Table.Row>
				<Table.Head>{travel_balance}</Table.Head>
				<Table.Head>{sick_balance}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell>FEB 2025</Table.Cell>
				<Table.Cell>BAL. BROUGHT FORWARD</Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>

	<div class="flex items-center justify-end py-2 mx-4">
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				size="sm"
			>
				Previous Year
			</Button>
			<Button
				variant="outline"
				size="sm"
			>
				Next Year
			</Button>
		</div>
	</div>

