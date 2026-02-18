<script lang="ts">
	import { enhance } from '$app/forms';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { user_points } from '$lib/store/accountDataStore';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { getTotalDays } from '$lib/utils/helper';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Form } from '@lucide/svelte';
	import type { PageProps } from './$types';

	$web_path_header = [{ path_name: 'Leave Request', route: '/leave-request' }];

	let { data }: PageProps = $props();

	const { employee, list_of_leave } = $derived(data);

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
		list_of_leave?.find((f) => f?.uuid === leave_selected)?.name ?? 'Select a Leave'
	);
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
			<p>{$user_points.vacation_points}</p>
		</div>
		<div>
			<p>Sick Leave Points:</p>
			<p>{$user_points.sick_points}</p>
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
				action="?/file-leave"
				method="post"
				use:enhance={({ formData }) => {
					formData.append('employee_uuid', employee.uuid);

					submitState = true;

					return async ({ result, update }) => {
						submitState = true;

						// if(result.type === 'failure'){

						// }

						await update();
					};
				}}
			>
				<Dialog.Content class="min-w-[550px]">
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
									{#each list_of_leave as leave}
										<Select.Item
											value={leave.uuid}
											label={leave.name}
											disabled={(leave.name.toLocaleLowerCase() === 'sick leave' &&
												$user_points.sick_points < 1) ||
												(leave.name.toLocaleLowerCase() === 'vacation leave' &&
													$user_points.vacation_points < 1)}
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
							<RangeCalendar bind:value={date_range} class="rounded-lg border" numberOfMonths={2} />

							{#if !isDateRangeValid}
								<p class="text-sm text-red-600">Please select both start and end dates. To announce for a single day, click the same date twice or double-click it.</p>
							{/if}
						</div>
						
					</div>
					<div class="grid gap-3">
						<Label for="contact_number">Contact Number</Label>
						<Input
							type="number"
							id="contact_number"
							name="contact_number"
							form="add_leave"
							required
						/>
					</div>
					<div class="grid gap-3">
						<Label for="reason">Reason</Label>
						<Textarea id="reason" name="reason" form="add_leave" />
					</div>
					{#if errorState}
						<p class="text-sm text-red-600">{errorState}</p>
					{/if}
					<Dialog.Footer>
						<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
						<Button type="submit" form="add_leave" disabled={submitState || !isDateRangeValid}>
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

<div class="mx-6 min-h-96 w-[100%-1.5rem] rounded-2xl border border-border bg-sidebar"></div>
