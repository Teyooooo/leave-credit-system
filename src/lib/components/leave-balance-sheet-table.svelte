<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { LeaveBalanceSheet } from '$lib/types/data';
	import { convertTimestamp } from '$lib/utils/helper';
	import { Download } from '@lucide/svelte';
	import * as Table from './ui/table';

	let { data } : { data: LeaveBalanceSheet[] } = $props()

	const grouped = $derived(data.reduce((acc, item) => {
			const year = new Date(item.created_at).getFullYear();
			if (!acc[year]) acc[year] = [];
			acc[year].push(item);
			return acc;
			}, {} as Record<number, LeaveBalanceSheet[]>));

	const years = $derived(Object.keys(grouped).map(Number).sort());
	let selectedYearIndex = $state(0);
	$effect(() => { selectedYearIndex = years.length - 1; }); // sync to latest when data changes
	const selectedYear = $derived(years[selectedYearIndex]);
	const currentYearData = $derived(grouped[selectedYear] ?? []);

	// svelte-ignore state_referenced_locally
		console.log({currentYearData})

	const first = $derived(currentYearData.at(0));
	let vacation_balance = $derived(first?.vacation_leave_balance ?? 0);
	let sick_balance = $derived(first?.sick_leave_balance ?? 0);

	async function exportPDF() {
		const { jsPDF } = await import('jspdf');
		const { default: autoTable } = await import('jspdf-autotable');

		const doc = new jsPDF({
			orientation: 'landscape',
			unit: 'in',
			format: [13, 8.5]
		});

		autoTable(doc, {
			html: '#table_balance_sheet',
			margin: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 },
			useCss: false,
			includeHiddenHtml: false,

			styles: {
			fontSize: 8,
			cellPadding: 0.06,
			halign: 'center',
			valign: 'middle',
			lineColor: [180, 180, 180],  // light gray border like shadcn
			lineWidth: 0.005,
			textColor: [0, 0, 0],
			fontStyle: 'normal',
			},

			headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			fontStyle: 'bold',
			lineColor: [180, 180, 180],
			lineWidth: 0.005,
			},

			bodyStyles: {
			fillColor: [255, 255, 255],
			},

			alternateRowStyles: {
			fillColor: [255, 255, 255], // disable alternating rows
			},

			// Match column widths to your table
			columnStyles: {
			0:  { cellWidth: 0.8 },   // PERIOD
			1:  { cellWidth: 1.4 },   // PARTICULARS
			2:  { cellWidth: 0.8 },   // VL EARNED
			3:  { cellWidth: 0.9 },   // VL Absence w/ Pay
			4:  { cellWidth: 0.8 },   // VL BALANCE
			5:  { cellWidth: 0.9 },   // VL Absence w/o Pay
			6:  { cellWidth: 0.8 },   // SL EARNED
			7:  { cellWidth: 0.9 },   // SL Absence w/ Pay
			8:  { cellWidth: 0.8 },   // SL BALANCE
			9:  { cellWidth: 0.9 },   // SL Absence w/o Pay
			10: { cellWidth: 2.5 },   // REMARKS
			},

			// Style specific cells (e.g. red text for late values)
			didParseCell(data) {
			// Red text for the late/undertime value (col 4 in body, odd rows)
			if (
				data.section === 'body' &&
				data.column.index === 4 &&
				data.row.index % 2 === 1  // late rows are even-indexed (0-based)
			) {
				data.cell.styles.textColor = [220, 38, 38]; // red
			}
			},
		});

		doc.save(`leave-balance-sheet-${selectedYear}.pdf`);
	}


</script>

	<div class="mx-4 flex justify-between items-center">
		<p class="text-xl font-bold">{selectedYear} Leave Balance Sheet</p>

		<Button onclick={exportPDF}>
			<Download /> Export as PDF
		</Button>
	</div>

	<Table.Root
		class="mx-auto w-[calc(100vw-2rem)] table-fixed border-collapse border [&_td]:border [&_td]:text-center [&_th]:border [&_th]:text-center [&_th]:font-bold mb-3"
		id="table_balance_sheet"
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
				<Table.Head>{vacation_balance}</Table.Head>
				<Table.Head>{sick_balance}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each currentYearData as item, index}
				 <!-- content here -->
				{#if index === 0}
					<Table.Row>
						<Table.Cell>{convertTimestamp(item.created_at, 'monthYearShort').toLocaleUpperCase()}</Table.Cell>
						<Table.Cell>BAL. BROUGHT FORWARD</Table.Cell>
						<Table.Cell>{item.vacation_leave_earned}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.vacation_leave_earned + item?.vacation_leave_balance}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.sick_leave_earned}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.sick_leave_earned + item?.sick_leave_balance}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.remarks}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell>{convertTimestamp(item.created_at, 'monthYearShort').toLocaleUpperCase()}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.vacation_leave_earned}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.vacation_leave_earned + item?.vacation_leave_balance}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.sick_leave_earned}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.sick_leave_earned + item?.sick_leave_balance}</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>{item.remarks}</Table.Cell>
					</Table.Row>
				{/if}

					<Table.Row class="h-[37px]">
						<Table.Cell></Table.Cell>
						{#if item.late_per_mins === 0}
							<Table.Cell></Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell></Table.Cell>
						{:else}
							<Table.Cell>{item.late_per_mins}</Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell class="text-red-600">{(item.late_per_mins / 480).toFixed(3) ?? ''}</Table.Cell>
							<Table.Cell>{((item.late_per_mins / 480) + item?.vacation_leave_balance).toFixed(2)}</Table.Cell>
						{/if}
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
					</Table.Row>

			{/each}


		</Table.Body>
	</Table.Root>

	<div class="flex items-center justify-end py-2 mx-4">
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				size="sm"
				disabled={selectedYearIndex <= 0}
				onclick={() => selectedYearIndex--}
			>
				Previous Year
			</Button>

			<span class="text-sm font-medium">{selectedYear}</span>

			<Button
				variant="outline"
				size="sm"
				disabled={selectedYearIndex >= years.length - 1}
				onclick={() => selectedYearIndex++}
			>
				Next Year
			</Button>
		</div>
	</div>

<style>
	@media print {
		@page {
			size: 13in 8.5in;  /* width height = landscape */
			margin: 0.5in;
		}
	}
</style>