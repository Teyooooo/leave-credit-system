<script lang="ts">
	import { enhance } from '$app/forms';
	import RangeCalendar from '$lib/components/ui/range-calendar/range-calendar.svelte';
	import * as Select from '$lib/components/ui/select';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import type { CreditPointsInfo, EmployeeData, EmployeeDataAdmin, LeaveData } from '$lib/types/data';
	import { convertTimestamp, getInitials, getTotalDays } from '$lib/utils/helper';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { ClipboardPenLine, Pen } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import EmployeeCreditsCard from './employee-credits-card.svelte';
	import * as Avatar from './ui/avatar';
	import { Button, buttonVariants } from './ui/button';
	import * as Dialog from './ui/dialog';
	import { Input } from './ui/input';
	import { Label } from './ui/label';
	import { Spinner } from './ui/spinner';

	let { employee, creditPoints, listsOfLeave, hr_info } : {employee: EmployeeDataAdmin | undefined, creditPoints: CreditPointsInfo | undefined, listsOfLeave: LeaveData[], hr_info: EmployeeData} = $props();

	let vacation_leave_points = $state(1.25);
	let sick_leave_points = $state(1.25);
	let balance_brought_forward = $state<number>();
	let remarks = $state('')
	let period = $state('')

	let addCreditDialogState = $state(false);
	let addCreditSubmitState = $state(false);
	let addCreditErrorState = $state<string | undefined>();
	let confirmAddCreditsDialogState = $state(false);
		
	let issueLeaveDialogState = $state(false);
	let issueLeaveSubmitState = $state(false);
	let issueLeaveErrorState = $state<string | undefined>();

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

	let isSelectedLeave = $derived(triggerContent === 'Select a Leave')

	// Check if totalDays is sufficient with its leave points
	let isInsufficient = $derived(
		(triggerContent.toLocaleLowerCase() === 'sick leave' &&
			(creditPoints?.sick_leave_points ?? 0) < totalDays) ||
			((triggerContent.toLocaleLowerCase() === 'vacation leave' || triggerContent.toLocaleLowerCase() === 'force leave') &&
				(creditPoints?.vacation_leave_points ?? 0) < totalDays)
	);

</script>

<div class="w-full border bg-inherit">
	<div class="mx-auto flex w-fit gap-10 py-4">
		<Avatar.Root class="size-60 text-9xl">
			<Avatar.Image src={employee?.profile_pic} alt={employee?.name} />
			<Avatar.Fallback>{getInitials(employee?.name ?? '')}</Avatar.Fallback>
		</Avatar.Root>
		<div>
			<div class="grid gap-2 py-3">
				<p class="grow font-light">Name</p>
				<p class="grow font-semibold">{employee?.name}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">ID</p>
				<p class="font-semibold">{employee?.employee_id}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Email</p>
				<p class="font-semibold">{employee?.email}</p>
			</div>
		</div>
		<div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Department</p>
				<p class="font-semibold">{employee?.department}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Position</p>
				<p class="font-semibold">{employee?.position}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Verified</p>
				<p class="font-semibold">{employee?.is_account_verified ? 'Yes' : 'No'}</p>
			</div>
		</div>
		<div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Created at</p>
				<p class="font-semibold">{employee?.created_at ? convertTimestamp(employee?.created_at, 'full') : '-'}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">System Role</p>
				<p class="font-semibold">{employee?.role_in_system}</p>
			</div>
			<div class="mt-4 grid gap-2 w-fit">
				<Button class="flex gap-2 items-center justify-baseline" onclick={()=>{addCreditDialogState=true}}>
					<ClipboardPenLine /> <span>Add Credits</span>
				</Button>

				<Button class="flex gap-2 items-center justify-baseline" onclick={()=>{issueLeaveDialogState=true}}>
					<Pen /> <span>Issue Leave Request</span>
				</Button>
			</div>
		</div>
	</div>
	<EmployeeCreditsCard {creditPoints} />
</div>

<Dialog.Root
	open={addCreditDialogState}
	onOpenChange={(open) => {
		addCreditDialogState = open;
		if(!open){
			vacation_leave_points = 1.25
			sick_leave_points = 1.25
			balance_brought_forward = undefined
			remarks = ''
			period = ''
		}
	}}
>
	<form
		action="?/add_credits"
		id="add_credits"
		method="POST"
		use:enhance={({ formData }) => {
			addCreditSubmitState = true;
			formData.append('uuid', employee?.uuid ?? '-');
			formData.append('sick_leave_balance', String(creditPoints?.sick_leave_points ?? 0));
			formData.append('vacation_leave_balance', String(creditPoints?.vacation_leave_points ?? 0));

			return async ({ result, update }) => {
				console.log(result);
				addCreditSubmitState = false;

				if (result.type === 'failure') {
					const data = result.data as { message?: string };
					addCreditErrorState = data?.message || 'Something went wrong';
				}

				if (result.type === 'success') {
					addCreditDialogState = false;
					addCreditErrorState = undefined;
					toast.success('Monthly points issue added successfully');
				}

				await update();
			};
		}}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Adding Credits</Dialog.Title>
			</Dialog.Header>
			<div class="grid gap-3">
				<Label for="vacation_leave">Period</Label>
				<Input
					id="period"
					name="period"
					form="add_credits"
					type="month"
					class="w-fit"
					bind:value={period}
					required
				/>
			</div>
			<div class="grid gap-3">
				<Label for="vacation_leave">Vacation Leave Credits</Label>
				<Input
					id="vacation_leave"
					name="vacation_leave"
					form="add_credits"
					type="number"
					step="0.01"
					bind:value={vacation_leave_points}
					required
				/>
			</div>
			<div class="grid gap-3">
				<Label for="sick_leave">Sick Leave Credits</Label>
				<Input
					id="sick_leave"
					name="sick_leave"
					form="add_credits"
					type="number"
					step="0.01"
					bind:value={sick_leave_points}
					required
				/>
			</div>
			<div class="grid gap-3">
				<Label for="balance_brought_forward">Balance Brought Forward</Label>
				<Input
					id="balance_brought_forward"
					name="balance_brought_forward"
					form="add_credits"
					type="number"
					bind:value={balance_brought_forward}
				/>
			</div>
			<div class="grid gap-3">
				<Label for="remarks">Remarks</Label>
				<Textarea id="remarks" name="remarks" form="add_credits" placeholder="Type here..." bind:value={remarks} />
			</div>
			{#if addCreditErrorState}
				<p class="text-sm text-red-600">{addCreditErrorState}</p>
			{/if}
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button onclick={() => (confirmAddCreditsDialogState = true)} disabled={addCreditSubmitState}>
					{#if addCreditSubmitState}
						<Spinner />
					{/if}
					Add
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>

<Dialog.Root
	bind:open={confirmAddCreditsDialogState}
	onOpenChange={(open) => {
		confirmAddCreditsDialogState = open;
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Confirm Adding Leave Credits</Dialog.Title>
			<Dialog.Description>
				<p>You are about to add:</p>
				<ul class="ms-10 mt-3 list-disc">
					<li>Period: {convertTimestamp(period, 'monthYear')}</li>
					<li>Vacation Leave: {vacation_leave_points}</li>
					<li>Sick Leave: {sick_leave_points}</li>
					<li>
						Balance Brought Forward: {balance_brought_forward ? balance_brought_forward : 0}
						{balance_brought_forward
							? balance_brought_forward > 1
								? 'minutes'
								: 'minute'
							: 'minute'}
					</li>
					<li>Remarks: <q>{remarks.length > 0 ? remarks : '-'}</q></li>
				</ul>
				<p class="mt-3">Do you want to continue?</p>
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
			<Button type="submit" form="add_credits" onclick={() => (confirmAddCreditsDialogState = false)}>
				Proceed
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root 
	bind:open={issueLeaveDialogState} 
	onOpenChange={open => {
		issueLeaveDialogState=open
		if(!open){
			date_range = {start, end}
			leave_selected = ''
		}
	}}
>
			<form
				action="?/issue_leave"
				method="post"
				id="issue_leave_form"
				use:enhance={({ formData }) => {
					// Validate date range before submission
					if (!date_range.start || !date_range.end) {
						issueLeaveErrorState = 'Please select both start and end dates';
						return async ({ update }) => {
							await update({ reset: false });
						};
					}

					issueLeaveSubmitState = true;
					issueLeaveDialogState = true;

					// Convert dates to ISO strings
					const startDate = date_range.start.toDate(getLocalTimeZone()).toISOString();
					const endDate = date_range.end.toDate(getLocalTimeZone()).toISOString();

					formData.append('start_date', startDate);
					formData.append('end_date', endDate);
					formData.append('sick_leave_points', String(creditPoints?.sick_leave_points))
					formData.append('vacation_leave_points', String(creditPoints?.vacation_leave_points))
					formData.append('leave_uuid', leave_selected);
					formData.append('leave_title', triggerContent)
					formData.append('total_days', String(totalDays))

					formData.append('employee_uuid', employee?.uuid ?? '-');
					formData.append('employee_id', String(employee?.employee_id ?? '-'));
					formData.append('employee_name', employee?.name ?? '-');

					formData.append('hr_uuid', hr_info.uuid)

					return async ({ result, update }) => {
						issueLeaveSubmitState = false;

						if (result.type === 'failure') {
							const data = result.data as { message?: string };
							issueLeaveErrorState = data?.message || 'An error occurred';
						}

						if (result.type === 'success') {
							issueLeaveSubmitState = false;
							issueLeaveErrorState = undefined;
							issueLeaveDialogState = false;
							toast.success('Issue Leave successfully');
						}

						await update();
					};
				}}
			>
				<Dialog.Content class="max-h-[80vh] w-sm overflow-y-auto">
					<Dialog.Header>
						<Dialog.Title>Issue a Leave</Dialog.Title>
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
												(creditPoints?.sick_leave_points ?? 0) < 1) ||
												((leave.name.toLocaleLowerCase() === 'vacation leave' || leave.name.toLocaleLowerCase() === 'force leave') &&
													(creditPoints?.vacation_leave_points ?? 0) < 1)}
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
							<Label for="entitlement">Date Duration</Label>
							<p class="text-sm">Total Days: {totalDays}</p>
						</div>
						<div class="grid gap-2">
						<div class="w-full">
							<RangeCalendar bind:value={date_range} class="mx-auto w-fit rounded-lg border"/>
						</div>

							{#if isInsufficient}
								<p class="text-sm text-red-600">Insufficient {triggerContent} points.</p>
							{/if}
							{#if !isDateRangeValid}
								<p class="text-sm text-red-600">
									Please select both start and end dates. To announce for a single day, click the
									same date twice or double-click it.
								</p>
							{/if}
						</div>
					</div>
					{#if issueLeaveErrorState}
						<p class="text-sm text-red-600">{issueLeaveErrorState}</p>
					{/if}
					<Dialog.Footer>
						<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
						<Button
							type="submit"
							form="issue_leave_form"
							disabled={issueLeaveSubmitState || !isDateRangeValid || isInsufficient || isSelectedLeave}
						>
							{#if issueLeaveSubmitState}
								<Spinner />
							{/if}
							Issue Leave</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</form>
</Dialog.Root>
