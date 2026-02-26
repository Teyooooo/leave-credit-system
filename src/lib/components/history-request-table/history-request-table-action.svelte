<script lang="ts">
	import HistoryRequestCard from '$lib/components/history-request-table/history-request-card.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { LeaveHistory } from '$lib/types/data';
	import { convertTimestamp } from '$lib/utils/helper';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';

	let { data }: { data: LeaveHistory } = $props();

	// svelte-ignore state_referenced_locally
		console.log({data})

    let dialogState = $state(false)

	async function generateLeaveForm() {
		console.log('generating leave form');

		const response = await fetch('/api/generate-document', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data })
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('Failed to generate document:', error);
			return;
		}

		// Convert response to blob
		const blob = await response.blob();

		// Create a temporary URL for the blob
		const url = URL.createObjectURL(blob);

		// Create a File name format
		const applicantName = String(data.employee_name).toLowerCase().split(' ').join('-');
		const dateFiled = convertTimestamp(data.date_filed, 'date')
			.toLowerCase()
			.replace(/,/g, '')
			.replace(/\s+/g, '-');
		const fileName = `leave-form-${applicantName}-${dateFiled}.docx`;

		// Create a hidden anchor and trigger download
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();

		// Cleanup
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item onclick={()=> dialogState = true}>View full details</DropdownMenu.Item>

			{#if data.status === 'Approve'}
				<DropdownMenu.Item onclick={generateLeaveForm}>Download Leave Form</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root
    open={dialogState}
    onOpenChangeComplete={open => {
        dialogState = open
    }}
>
	<Dialog.Content id="dialog_{data.filed_uuid}">
		<Dialog.Header>
			<Dialog.Title>Full Details</Dialog.Title>
            <HistoryRequestCard {data} />
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
