<script lang="ts">
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { user_points } from '$lib/store/userInfo';
	import type { ClientFiledLeaveInfo, EmployeeData, LeaveData } from '$lib/types/data';
	import { convertCalendarDate, convertTimestamp, getTotalDays } from '$lib/utils/helper';
	import { fromDate, getLocalTimeZone, toCalendarDate } from '@internationalized/date';
	import { SquarePen, Trash } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let {
		filedInfo,
		employee,
		listsOfLeave
	}: { filedInfo: ClientFiledLeaveInfo; employee: EmployeeData; listsOfLeave: LeaveData[] } =
		$props();

	let editDialogStates = $state<Record<string, boolean>>({});
	let editSubmitStates = $state<Record<string, boolean>>({});
	let editErrorStates = $state<Record<string, string | undefined>>({});

	let deleteDialogStates = $state<Record<string, boolean>>({});
	let deleteSubmitStates = $state<Record<string, boolean>>({});
	let deleteErrorStates = $state<Record<string, string | undefined>>({});

	// for the form values
	// leave start - end
	let form_date_range = $derived({
		start: convertCalendarDate(filedInfo.leave_start),
		end: convertCalendarDate(filedInfo.leave_end)
	});

	// Check if date range is complete
	let isDateRangeValid = $derived(form_date_range.start && form_date_range.end);

	let totalDays = $state(0);
	$effect(() => {
		totalDays = getTotalDays(form_date_range.start, form_date_range.end);
	});

	// type of leave
	let form_leave_selected: string = $derived(
		listsOfLeave?.find((f) => f?.name === filedInfo.type_leave)?.uuid ?? ''
	);
	const triggerContent = $derived(
		listsOfLeave?.find((f) => f?.uuid === form_leave_selected)?.name ?? 'Select a Leave'
	);

	// for the contact number
	let form_contact_number = $derived(filedInfo.contact_number);
	$effect(() => {
		form_contact_number = form_contact_number.replace(/\D/g, '').slice(0, 11);
	});

	// for the reason
	let form_reason = $derived(filedInfo.reason)

	const toLocalDateStr = (ts: string) => 
		toCalendarDate(fromDate(new Date(ts), getLocalTimeZone())).toString();

	let valueHasChange = $derived(
		form_leave_selected !== (listsOfLeave?.find((f) => f?.name === filedInfo.type_leave)?.uuid ?? '') ||
		form_date_range.start?.toString() !== toLocalDateStr(filedInfo.leave_start) ||
		form_date_range.end?.toString() !== toLocalDateStr(filedInfo.leave_end) ||
		form_contact_number !== filedInfo.contact_number ||
		form_reason !== filedInfo.reason
	);
	$effect(()=>{
		console.log({valueHasChange})
	})


	function reset_form(){
		form_date_range = {
			start: toCalendarDate(fromDate(new Date(filedInfo.leave_start), getLocalTimeZone())),
			end: toCalendarDate(fromDate(new Date(filedInfo.leave_end), getLocalTimeZone()))
		};
		form_leave_selected = listsOfLeave?.find((f) => f?.name === filedInfo.type_leave)?.uuid ?? '';
		form_contact_number = filedInfo.contact_number;
		form_reason = filedInfo.reason
	}


</script>

<Card.Root class="flex flex-row! gap-4">
	<div class="grow">
		<Card.Header class="mb-2">
			<div class="flex gap-10 items-center">
				<Card.Title>{filedInfo.type_leave}</Card.Title>
				<Badge class="bg-amber-500 text-black-500">Pending</Badge>
			</div>
			<Card.Description class="text-[12px]">Filed at: {convertTimestamp(filedInfo.date_filed, 'full')}</Card.Description>
		</Card.Header>
		<Card.Content class="[&_div>p:first-child]:text-muted-foreground [&_div>p:first-child]:font-light [&_div>p:last-child]:font-semibold  **:text-sm" >
			<div class="flex gap-3">
				<p>
					Leave Date:
				</p>
				<p>
					{convertTimestamp(filedInfo.leave_start, 'date')} - {convertTimestamp(filedInfo.leave_end,'date')}
				</p>
			</div>
			<div class="flex gap-3">
				<p>
					Total Days:
				</p>
				<p>
					{filedInfo.total_days}
				{filedInfo.total_days > 1 ? 'days' : 'day'}
				</p>
			</div>
			<div class="flex gap-3">
				<p>
					Contact Number:
				</p>
				<p>
					{filedInfo.contact_number}
				</p>
			</div>
			<div class="flex gap-3">
				<p>
					Reason:
				</p>
				<q class="italic">{filedInfo.reason}</q>
			</div>
		</Card.Content>
	</div>
	<Card.Footer class="flex flex-col-reverse gap-2">
		<Button onclick={() => (editDialogStates[filedInfo.uuid] = true)}><SquarePen /></Button>
		<Button variant="destructive" onclick={() => (deleteDialogStates[filedInfo.uuid] = true)}
			><Trash />
		</Button>
	</Card.Footer>
</Card.Root>

<!-- For Edit Submission -->
<Dialog.Root
	open={editDialogStates[filedInfo.uuid] || false}
	onOpenChange={(open) => {
		editDialogStates[filedInfo.uuid] = open;

		if (!open) {
			editErrorStates[filedInfo.uuid] = undefined;
		}

		reset_form()
	}}
>
	<form
		id="edit_filed_{filedInfo.uuid}"
		action="?/edit_filed"
		method="post"
		use:enhance={({ formData }) => {
			// Validate date range before submission
			if (!form_date_range.start || !form_date_range.end) {
				editErrorStates[filedInfo.uuid] = 'Please select both start and end dates';
				return async ({ update }) => {
					await update({ reset: false });
				};
			}

			editSubmitStates[filedInfo.uuid] = true;
			editDialogStates[filedInfo.uuid] = true;

			// Convert dates to ISO strings
			const startDate = form_date_range.start.toDate(getLocalTimeZone()).toISOString();
			const endDate = form_date_range.end.toDate(getLocalTimeZone()).toISOString();

			formData.append('date_range_start', startDate);
			formData.append('date_range_end', endDate);
			formData.append('employee_uuid', employee.uuid);
			formData.append('type_of_leave', form_leave_selected);
			formData.append('uuid', filedInfo.uuid);

			return async ({ result, update }) => {
				editSubmitStates[filedInfo.uuid] = false;

				if (result.type === 'failure') {
					const data = result.data as { message?: string };
					editErrorStates[filedInfo.uuid] = data?.message || 'An error occurred';
				}

				if (result.type === 'success') {
					editDialogStates[filedInfo.uuid] = false;
					editErrorStates[filedInfo.uuid] = undefined;
					toast.success('Updated filed leave successfully');
				}

				await update();
			};
		}}
	>
		<Dialog.Content class="min-w-137.5">
			<Dialog.Header>
				<Dialog.Title>Edit File Leave</Dialog.Title>
			</Dialog.Header>
			<div class="grid gap-3">
				<Label for="type_of_leave">Type of Leave</Label>
				<Select.Root type="single" name="type_of_leave" bind:value={form_leave_selected}>
					<Select.Trigger class="w-full">
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Types of Leave</Select.Label>
							{#each listsOfLeave as leave}
								<Select.Item
									value={leave.uuid}
									label={leave.name}
									disabled={(leave.name.toLocaleLowerCase() === 'sick leave' &&
										($user_points.sick ?? 0) < 1) ||
										(leave.name.toLocaleLowerCase() === 'vacation leave' &&
											($user_points.vacation ?? 0) < 1)}
								>
									{leave.name}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-3">
				<div class="flex justify-between">
					<Label for="entitlement">Inclusive Date</Label>
					<p class="text-sm">Total Days: {totalDays}</p>
				</div>
				<div class="grid gap-2">
					<RangeCalendar bind:value={form_date_range} class="rounded-lg border" numberOfMonths={2} />

					{#if !isDateRangeValid}
						<p class="text-sm text-red-600">
							Please select both start and end dates. To announce for a single day, click the same
							date twice or double-click it.
						</p>
					{/if}
				</div>
			</div>
			<div class="grid gap-3">
				<Label for="contact_number">Contact Number</Label>
				<Input
					type="text"
					inputmode="numeric"
					id="contact_number"
					name="contact_number"
					form="edit_filed_{filedInfo.uuid}"
					bind:value={form_contact_number}
					required
				/>
			</div>
			<div class="grid gap-3">
				<Label for="reason">Reason</Label>
				<Textarea
					id="reason"
					name="reason"
					form="edit_filed_{filedInfo.uuid}"
					bind:value={form_reason}
					required
				/>
			</div>
			{#if editErrorStates[filedInfo.uuid]}
				<p class="text-sm text-red-600">{editErrorStates[filedInfo.uuid]}</p>
			{/if}
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button
					type="submit"
					form="edit_filed_{filedInfo.uuid}"
					disabled={editSubmitStates[filedInfo.uuid] || !isDateRangeValid || !valueHasChange}
				>
					{#if editSubmitStates[filedInfo.uuid]}
						<Spinner />
					{/if}
					Update</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>

<!-- For Deleting Submission -->
<Dialog.Root
	open={deleteDialogStates[filedInfo.uuid] || false}
	onOpenChange={(open) => {
		deleteDialogStates[filedInfo.uuid] = open;

		if (!open) {
			deleteErrorStates[filedInfo.uuid] = undefined;
		}
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete this filed leave and remove your
				data from our servers.
			</Dialog.Description>
		</Dialog.Header>
		{#if deleteErrorStates[filedInfo.uuid]}
			<p class="text-sm text-red-600">{deleteErrorStates[filedInfo.uuid]}</p>
		{/if}
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
			<form
				id="delete_filed_{filedInfo.uuid}"
				action="?/delete_filed"
				method="post"
				use:enhance={({ formData }) => {
					formData.append('uuid', filedInfo.uuid);
					deleteSubmitStates[filedInfo.uuid] = true;

					return async ({ result, update }) => {
						deleteSubmitStates[filedInfo.uuid] = false;
						console.log({ result });

						if (result.type === 'failure') {
							const data = result.data as { message?: string };
							deleteErrorStates[filedInfo.uuid] = data?.message || 'An error occurred';
						}

						if (result.type === 'success') {
							deleteErrorStates[filedInfo.uuid] = undefined;
							deleteDialogStates[filedInfo.uuid] = false;
							toast.success('Removing filed leave successfully');
						}
						await update();
					};
				}}
			>
				<Button
					type="submit"
					variant="destructive"
					form="delete_filed_{filedInfo.uuid}"
					disabled={deleteSubmitStates[filedInfo.uuid]}
				>
					{#if deleteSubmitStates[filedInfo.uuid]}
						<Spinner />
					{/if}Delete
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
