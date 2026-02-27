<script lang="ts">
	import { enhance } from '$app/forms';
	import FiledLeavePendingContainer from '$lib/components/filed_leave_pending_container.svelte';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { user_points } from '$lib/store/userInfo';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { getTotalDays } from '$lib/utils/helper';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Form } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	
	let { data }: PageProps = $props();
	const { employee, listsOfLeave, creditInfo, allFiledLeave } = $derived(data);

	$web_path_header = [{ path_name: 'Leave Request', route: '/leave-request' }];
	$effect(()=>{
		$user_points = {vacation: creditInfo?.vacation_leave_points ?? 0, sick: creditInfo?.sick_leave_points ?? 0}
	})


	// for the form
	let dialogState = $state(false);
	let submitState = $state(false);
	let errorState = $state<string | undefined>();

	// for the form values
	// leave start - end
	const start = today(getLocalTimeZone());
	const end = start.add({ days: 1 });
	let date_range = $state({
		start,
		end
	});

	// Check if date range is complete
	let isDateRangeValid = $derived(date_range.start && date_range.end);

	
	let totalDays = $state(0);
	$effect(() => {
		totalDays = getTotalDays(date_range.start, date_range.end);
	});
	
	// type of leave
	let leave_selected = $state('');
	const triggerContent = $derived(
		listsOfLeave?.find((f) => f?.uuid === leave_selected)?.name ?? 'Select a Leave'
	);
	
    // Check if totalDays is sufficient with its leave points
    let isInsufficient = $derived(
        (triggerContent.toLocaleLowerCase() === 'sick leave' &&
        (creditInfo?.sick_leave_points ?? 0) < totalDays) ||
        (triggerContent.toLocaleLowerCase() === 'vacation leave' &&
        (creditInfo?.vacation_leave_points ?? 0) < totalDays))

	// for the contact number
	let contact_number = $state('')
	$effect(() => {
		contact_number = contact_number
			.replace(/\D/g, '')
			.slice(0, 11);

		console.log({allFiledLeave})
	});
</script>

<div class="me-6 flex items-center justify-between">
	<HeaderPage
		title={'Leave Request'}
		message={'Submit a leave request by selecting the leave type, dates, and reason.'}
	/>
	<div
		class="grid gap-1 [&_div]:flex [&_div]:gap-3 [&_div>p]:text-lg [&_div>p]:font-semibold [&_div>p:first-child]:grow [&_div>p:first-child]:text-muted-foreground"
	>
		<div>
			<p>Vacation Leave Points:</p>
			<p>{creditInfo?.vacation_leave_points ?? 0}</p>
		</div>
		<div>
			<p>Sick Leave Points:</p>
			<p>{creditInfo?.sick_leave_points ?? 0}</p>
		</div>
		<Dialog.Root
			open={dialogState}
			onOpenChange={(open) => {
				dialogState = open;
				if (!open) {
					errorState = undefined;
				}
			}}
		>
			<Dialog.Trigger class={[buttonVariants(), 'mt-3 justify-start!']}><Form /> File a Leave</Dialog.Trigger>
			<form
				action="?/file_leave"
				method="post"
				id="file_leave_form"
				use:enhance={({ formData }) => {
					 // Validate date range before submission
					if (!date_range.start || !date_range.end) {
						errorState = 'Please select both start and end dates';
						return async ({ update }) => {
							await update({ reset: false });
						};
					}

					submitState = true
					dialogState = true

					// Convert dates to ISO strings
					const startDate = date_range.start.toDate(getLocalTimeZone()).toISOString();
					const endDate = date_range.end.toDate(getLocalTimeZone()).toISOString();

					formData.append('date_range_start', startDate);
					formData.append('date_range_end', endDate);
					formData.append('employee_uuid', employee.uuid);
					formData.append('type_of_leave', leave_selected);


					return async ({ result, update }) => {
						submitState = false;

						if(result.type === 'failure'){
							const data = result.data as { message?: string };
							errorState = data?.message || 'An error occurred';
						}

						if (result.type === 'success') {
							dialogState = false;
							errorState = undefined;
							toast.success("Filing Leave successfully")
						}

						await update();
					};
				}}
			>
				<Dialog.Content class="w-sm max-h-[80vh] overflow-y-auto">
					<Dialog.Header>
						<Dialog.Title>File a Leave</Dialog.Title>
					</Dialog.Header>
					<div class="grid gap-3">
						<Label for="type_of_leave">Type of Leave</Label>
						<Select.Root type="single" name="type_of_leave" bind:value={leave_selected}>
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
												(creditInfo?.sick_leave_points ?? 0) < 1) ||
												(leave.name.toLocaleLowerCase() === 'vacation leave' &&
												(creditInfo?.vacation_leave_points ?? 0) < 1)}
										>
											{leave.name}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>

					{#if isInsufficient}
						<p class="text-sm text-red-600">Insufficient {triggerContent} points.</p>
					{/if}

					<div class="grid gap-3">
						<div class="flex justify-between">
							<Label for="entitlement">Inclusive Date</Label>
							<p class="text-sm">Total Days: {totalDays}</p>
						</div>
						<div class="grid gap-2">
							<RangeCalendar bind:value={date_range} class="rounded-lg border w-fit" />

							{#if !isDateRangeValid}
								<p class="text-sm text-red-600">Please select both start and end dates. To announce for a single day, click the same date twice or double-click it.</p>
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
							form="file_leave_form"
							bind:value={contact_number}
							required
						/>
					</div>
					<div class="grid gap-3">
						<Label for="reason">Reason</Label>
						<Textarea id="reason" name="reason" form="file_leave_form" required/>
					</div>
					{#if errorState}
						<p class="text-sm text-red-600">{errorState}</p>
					{/if}
					<Dialog.Footer>
						<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
						<Button type="submit" form="file_leave_form" disabled={submitState || !isDateRangeValid || isInsufficient}>
							{#if submitState}
								<Spinner />
							{/if}
							File Leave</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</form>
		</Dialog.Root>
	</div>
</div>

<div class="mx-6 min-h-96 w-[100%-1.5rem] grid gap-4">
	<FiledLeavePendingContainer filedLeave={allFiledLeave} {employee} {listsOfLeave} />
</div>


